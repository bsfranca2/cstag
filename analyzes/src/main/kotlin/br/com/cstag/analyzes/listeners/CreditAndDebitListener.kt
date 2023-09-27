package br.com.cstag.analyzes.listeners

import br.com.cstag.adapters.messagebroker.rabbit.SerializationUtil
import br.com.cstag.core.dto.messages.CreditAndDebitAnalysisMessageDto
import br.com.cstag.core.services.analyze.AnalyzeCreditAndDebitService
import br.com.cstag.core.valueobjects.CNPJ
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration

@Configuration
class CreditAndDebitListener {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Autowired
    lateinit var analyzeCreditAndDebitService: AnalyzeCreditAndDebitService

    @RabbitListener(queues = ["a_credit_debit"])
    fun analyzePlazaValue(message: Message) {
        logger.info("Iniciando analise de credito e debito")
        val (cnpj, trip, invoiceId) = SerializationUtil.deserialize(message.body, CreditAndDebitAnalysisMessageDto::class.java)
        logger.info(trip)
        try {
            analyzeCreditAndDebitService.execute(CNPJ(cnpj), trip, invoiceId)
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
        }
        logger.info("Finalizao analise debito/credito $trip")
    }
}