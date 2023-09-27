package br.com.cstag.analyzes.listeners

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.dto.messages.TollPlazaMessageDto
import br.com.cstag.core.services.tollPlaza.TollPlazaSheetService
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ImportTollPlazaSheetListener {
    @Autowired
    lateinit var tollPlazaSheetService: TollPlazaSheetService
    private val logger = LoggerFactory.getLogger(this::class.java)
    @RabbitListener(queues = ["i_plaza_sheet"])
    fun importInvoice(message: Message) {
        logger.info("Iniciando importacao de planilha valores da praça")
        val clazz = TollPlazaMessageDto::class.java
        val dto = SerializationUtil.deserialize(message.body, clazz)
        try {
            tollPlazaSheetService.importSheet(dto)
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
        }
        logger.info("Finalizado a importacao de planilha valores da praça")
    }
}