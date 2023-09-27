package br.com.cstag.core.services.invoice

import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.InvoiceRepository
import br.com.cstag.core.valueobjects.CNPJ
import org.hibernate.FetchMode
import org.hibernate.SessionFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class InvoiceService(
    private val invoiceRepository: InvoiceRepository,
    private val sessionFactory: SessionFactory,
) {
    fun findById(id: Long): Invoice {
        return invoiceRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Fatura $id não encontrada")
    }

    fun findByIdEager(id: Long): Invoice {
        val session = sessionFactory.openSession()
        val criteria = session.createCriteria(Invoice::class.java)
        criteria.setFetchMode("tickets", FetchMode.EAGER)
        criteria.setFetchMode("credits", FetchMode.EAGER)
        criteria.setFetchMode("monthlyPayments", FetchMode.EAGER)
        val invoice = session.find(Invoice::class.java, id)
        invoice.tickets.size // gambiarra
        invoice.credits.size // gambiarra
        invoice.monthlyPayments.size // gambiarra
        session.close()
        return invoice
    }

    fun findByShippingCompanyAndIdentifier(shippingCompany: ShippingCompany, identifier: String): Invoice {
        return invoiceRepository.findByShippingCompanyAndIdentifier(shippingCompany, identifier)
            ?: throw NotFoundException("Fatura $identifier da transportadora ${shippingCompany.companyName} não encontrada")
    }

    fun findByShippingCompanyCNPJ(companyCNPJ: CNPJ): MutableList<Invoice> {
        return invoiceRepository.findByShippingCompany_Cnpj(companyCNPJ)
    }

    @Transactional
    fun save(invoice: Invoice): Invoice {
        return invoiceRepository.save(invoice)
    }

    @Transactional
    fun delete(invoice: Invoice) {
        invoiceRepository.delete(invoice)
    }

    fun delete(invoiceId: Long) {
        invoiceRepository.deleteById(invoiceId)
    }

    /*fun deleteWithConfirmation(accountCNPJ: CNPJ, invoiceId: Long) {
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
    }*/
}