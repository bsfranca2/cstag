package br.com.cstag.analyzes.listeners

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.services.analyze.TicketAnalysisService
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TicketAnalysisListener {
    @Autowired
    lateinit var ticketAnalysisService: TicketAnalysisService

    private val logger = LoggerFactory.getLogger(this::class.java)

    @RabbitListener(queues = ["a_general"])
    fun analyzePlazaValue(message: Message) {
        logger.info("Recebendo mensagem para analise")
        val ticketId = SerializationUtil.deserialize(message.body, Long::class.java)
        logger.info("Iniciando analise para passagem $ticketId")
        try {
            ticketAnalysisService.analyze(ticketId)
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
        }
        logger.info("Finalizando analise para passagem $ticketId")
    }
}