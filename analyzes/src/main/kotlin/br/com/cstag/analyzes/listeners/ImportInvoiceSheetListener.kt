package br.com.cstag.analyzes.listeners

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.dto.messages.InvoiceSheetMessageDto
import br.com.cstag.core.services.invoice.ImportInvoiceService
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ImportInvoiceSheetListener {
    @Autowired
    lateinit var importInvoiceService: ImportInvoiceService
    private val logger = LoggerFactory.getLogger(this::class.java)

    @RabbitListener(queues = ["i_invoice_sheet"])
    fun importInvoice(message: Message) {
        logger.info("Iniciando importação de planilha")
        val dto = SerializationUtil.deserialize(message.body, InvoiceSheetMessageDto::class.java)
        logger.info("[Invoice=${dto.invoiceId}]")
        try {
            importInvoiceService.importSheet(dto)
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
        }
        logger.info("Finalizado a importação - [Invoice=${dto.invoiceId}]")
    }
}