package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.constants.MessageBrokerConstant
import br.com.cstag.core.dto.CreditAndDebitMessageDto
import br.com.cstag.core.dto.InvoiceSheetMessageDto
import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.semparar.InvoiceSemParar
import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.MessageBrokerGateway
import br.com.cstag.core.gateways.StorageGateway
import br.com.cstag.core.services.AccountService
import br.com.cstag.core.services.InvoiceService
import br.com.cstag.core.valueobjects.CNPJ
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.File
import java.util.*
import javax.transaction.Transactional
import javax.xml.bind.ValidationException

@Service
class InvoiceSemPararService(
    private val accountService: AccountService,
    private val invoiceService: InvoiceService,
    private val storageGateway: StorageGateway,
    private val messageBrokerGateway: MessageBrokerGateway,
    private val excelGateway: ExcelGateway
) {
    companion object {
        private val BUCKET_NAME = System.getenv("BUCKET_NAME")
        private val logger = LoggerFactory.getLogger(this::class.java)
    }

    @Transactional
    fun createInvoiceAndUpload(accountCNPJ: CNPJ, sheetFile: File) {
        val account = accountService.findAccountByCNPJ(accountCNPJ)
        val shippingCompany = account.company.getShippingCompany()
        val invoiceDataMiner = InvoiceDataMiner(excelGateway)
        val invoice = invoiceDataMiner.getInvoiceIdentifier(shippingCompany, sheetFile)
        kotlin.runCatching {
            invoiceService.findById(invoice.number)
        }.onSuccess {
            throw ValidationException("Fatura ja importada")
        }
        val invoiceSaved = invoiceService.save(invoice)
        uploadSheetAndSendMessage(invoiceSaved, sheetFile)
    }

    fun uploadSheetAndSendMessage(invoice: Invoice, sheetFile: File) {
        logger.info("Enviando planilha fatura sem parar")
        val bucketName = BUCKET_NAME
        val objectName = UUID.randomUUID().toString() + ".xlsx"
        storageGateway.putObject(bucketName, objectName, sheetFile)
        val exchange = MessageBrokerConstant.IMPORT_EXCHANGE
        val routingKey = MessageBrokerConstant.IMPORT_INVOICE_SHEET_KEY
        val obj = InvoiceSheetMessageDto(invoice.number, bucketName,  objectName)
        val clazz = InvoiceSheetMessageDto::class.java
        messageBrokerGateway.sendToExchange(exchange, routingKey, obj, clazz)
        logger.info("Envio finalizado planilha fatura sem parar")
    }

    fun importSheet(messageDto: InvoiceSheetMessageDto) {
        val file = storageGateway.getObject(messageDto.bucketName, messageDto.objectName)
        val invoiceDataMiner = InvoiceDataMiner(excelGateway)
        var invoice = invoiceService.findById(messageDto.invoiceId)
        if (invoice is InvoiceSemParar) {
            val invoiceExtracted = invoiceDataMiner.extract(invoice.shippingCompany, file)
            invoiceExtracted.progress = invoice.progress
            invoice = invoiceExtracted
        }
        val trips = getTollValleyTrip(invoice)
        invoice.progress.ticketTotal = invoice.tollTickets.size
        invoice.progress.creditTotal = trips.size
        val invoiceSaved = invoiceService.save(invoice)
        invoiceSaved.tollTickets.forEach { sendTicketMessage(it.id) }
        trips.forEach {
            val message = CreditAndDebitMessageDto(invoiceSaved.shippingCompany.cnpj.value, it, invoice.number)
            sendCreditMessage(message)
        }
    }

    private fun sendTicketMessage(id: Long) {
        val exchange = MessageBrokerConstant.ANALYZE_EXCHANGE
        val routingKey = MessageBrokerConstant.ANALYZE_TICKET_KEY
        val clazz = Long::class.java
        messageBrokerGateway.sendToExchange(exchange, routingKey, id, clazz)
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