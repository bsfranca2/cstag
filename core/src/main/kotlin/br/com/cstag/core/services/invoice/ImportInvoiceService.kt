package br.com.cstag.core.services.invoice

import br.com.cstag.core.constants.MessageBrokerConstant
import br.com.cstag.core.dto.messages.CreditAndDebitAnalysisMessageDto
import br.com.cstag.core.dto.messages.InvoiceSheetMessageDto
import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.MessageBrokerGateway
import br.com.cstag.core.gateways.StorageGateway
import br.com.cstag.core.services.invoice.semparar.InvoiceDataMiner
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.File
import java.util.*
import javax.transaction.Transactional
import javax.xml.bind.ValidationException

@Service
class ImportInvoiceService(
    private val invoiceService: InvoiceService,
    private val storageGateway: StorageGateway,
    private val messageBrokerGateway: MessageBrokerGateway,
    private val excelGateway: ExcelGateway
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    companion object {
        private val BUCKET_NAME = System.getenv("BUCKET_NAME")
    }

    fun createInvoiceAndUpload(account: Account, operatorCompany: OperatorCompany, sheetFile: File) {
        val invoice = createInvoice(account, operatorCompany, sheetFile)
        uploadSheetAndSendMessage(invoice, sheetFile)
    }

    @Transactional
    fun createInvoice(account: Account, operatorCompany: OperatorCompany, sheetFile: File): Invoice {
        val shippingCompany = account.company.getShippingCompany()
        val invoice = when(operatorCompany) {
            OperatorCompany.SemParar -> {
                val invoiceDataMiner = InvoiceDataMiner(excelGateway)
                invoiceDataMiner.getInvoiceIdentifier(shippingCompany, sheetFile)
            }
        }
        kotlin.runCatching {
            invoiceService.findByShippingCompanyAndIdentifier(shippingCompany, invoice.identifier)
        }.onSuccess {
            throw ValidationException("Fatura com o identificador ${invoice.identifier} ja importada")
        }
        return invoiceService.save(invoice)
    }

    fun uploadSheetAndSendMessage(invoice: Invoice, sheetFile: File) {
        logger.info("Enviando planilha da fatura")
        val bucketName = BUCKET_NAME
        val objectName = UUID.randomUUID().toString() + ".xlsx"
        storageGateway.putObject(bucketName, objectName, sheetFile)
        val exchange = MessageBrokerConstant.IMPORT_EXCHANGE
        val routingKey = MessageBrokerConstant.IMPORT_INVOICE_SHEET_KEY
        val obj = InvoiceSheetMessageDto(invoice.id, bucketName,  objectName)
        val clazz = InvoiceSheetMessageDto::class.java
        messageBrokerGateway.sendToExchange(exchange, routingKey, obj, clazz)
        logger.info("Planilha enviada com sucesso")
    }

    fun importSheet(messageDto: InvoiceSheetMessageDto) {
        val invoice = invoiceService.findByIdEager(messageDto.invoiceId)
        val file = storageGateway.getObject(messageDto.bucketName, messageDto.objectName)
        when(invoice.operatorCompany) {
            OperatorCompany.SemParar -> {
                val invoiceDataMiner = InvoiceDataMiner(excelGateway)
                val (tickets, credits, monthlyPayments) = invoiceDataMiner.extract(invoice, file)
                invoice.tickets.addAll(tickets)
                invoice.credits.addAll(credits)
                invoice.monthlyPayments.addAll(monthlyPayments)
            }
        }
        invoice.progress.totalOfTickets = invoice.tickets.size
        invoice.progress.totalOfCredits = invoice.trips().size
        val invoiceSaved = invoiceService.save(invoice)
        invoiceSaved.tickets.forEach { sendTicketMessage(it.id) }
        invoiceSaved.trips().forEach { sendTripMessage(invoiceSaved, it) }
    }

    private fun sendTicketMessage(id: Long) {
        val exchange = MessageBrokerConstant.ANALYZE_EXCHANGE
        val routingKey = MessageBrokerConstant.ANALYZE_TICKET_KEY
        val clazz = Long::class.java
        messageBrokerGateway.sendToExchange(exchange, routingKey, id, clazz)
    }

    private fun sendTripMessage(invoice: Invoice, trip: String) {
        val exchange = MessageBrokerConstant.ANALYZE_EXCHANGE
        val routingKey = MessageBrokerConstant.ANALYZE_CREDIT_KEY
        val clazz = CreditAndDebitAnalysisMessageDto::class.java
        val dto = CreditAndDebitAnalysisMessageDto(
            shippingCompanyId = invoice.shippingCompany.cnpj.value,
            trip = trip,
            invoiceId = invoice.id
        )
        messageBrokerGateway.sendToExchange(exchange, routingKey, dto, clazz)
    }
}