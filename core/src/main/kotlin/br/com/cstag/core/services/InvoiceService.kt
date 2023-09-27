package br.com.cstag.core.services

import br.com.cstag.core.constants.MessageBrokerConstant
import br.com.cstag.core.dto.CreditAndDebitMessageDto
import br.com.cstag.core.dto.toTollTicketAnalysisSearchDto
import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.exceptions.ValidationException
import br.com.cstag.core.gateways.MessageBrokerGateway
import br.com.cstag.core.gateways.SearchEngineGateway
import br.com.cstag.core.repositories.InvoiceRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class InvoiceService(
    private val invoiceRepository: InvoiceRepository,
    private val searchEngineGateway: SearchEngineGateway,
    private val messageBrokerGateway: MessageBrokerGateway,
) {
    fun findByShippingCompanyCNPJ(companyCNPJ: CNPJ): MutableList<Invoice> {
        return invoiceRepository.findByShippingCompany_Cnpj(companyCNPJ)
    }

    @Transactional
    fun save(invoice: Invoice): Invoice {
        return invoiceRepository.save(invoice)
    }

    fun findById(id: Long): Invoice {
        return invoiceRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Fatura $id não encontrada")
    }

    @Transactional
    fun delete(invoice: Invoice) {
        invoiceRepository.delete(invoice)
    }

    fun deleteWithConfirmation(accountCNPJ: CNPJ, invoiceId: Long) {
        val invoice = findById(invoiceId)
        if (invoice.shippingCompany.cnpj.value != accountCNPJ.value)
            throw ValidationException("You don't have permissions")
        val analysisSearchDto = invoice.tollTickets.mapNotNull { it.analysis?.toTollTicketAnalysisSearchDto() }
        val trips = getTollValleyTrip(invoice)
        delete(invoice)
        searchEngineGateway.remove(analysisSearchDto.toTypedArray())
        trips.forEach {
            val message = CreditAndDebitMessageDto(invoice.shippingCompany.cnpj.value, it)
            sendCreditMessage(message)
        }
    }

    private fun getTollValleyTrip(invoice: Invoice): MutableSet<String> {
        val trips = mutableSetOf<String>()
        invoice.tollTickets.forEach {
            if (it is TollValleyTicketSemParar)
                it.trip?.let { trip -> trips.add(trip) }
        }
        invoice.tollValleyCredits.forEach {
            if (it is TollValleyCreditSemParar)
                it.trip?.let { trip -> trips.add(trip) }
        }
        return trips
    }

    private fun sendCreditMessage(dto: CreditAndDebitMessageDto) {
        val exchange = MessageBrokerConstant.ANALYZE_EXCHANGE
        val routingKey = MessageBrokerConstant.ANALYZE_CREDIT_KEY
        val clazz = CreditAndDebitMessageDto::class.java
        messageBrokerGateway.sendToExchange(exchange, routingKey, dto, clazz)
    }
}