package br.com.cstag.port.analyzes.listeners

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.services.analyze.AnalyzeTollPlazaService
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

@Component
class PlazaValueListener {
    @Autowired
    lateinit var analyzeTollPlazaService: AnalyzeTollPlazaService

    private val logger = LoggerFactory.getLogger(this::class.java)

    @RabbitListener(queues = ["a_plaza_value"])
    fun analyzePlazaValue(message: Message) {
        logger.info("Recebendo mensagem para analise")
        val tollTicketId = SerializationUtil.deserialize(message.body, Long::class.java)
        logger.info("Iniciando analise para $tollTicketId")
        try {
            analyzeTollPlazaService.analyze(tollTicketId)
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
            throw e
        }
        logger.info("Finalizando analise para $tollTicketId")
    }

}