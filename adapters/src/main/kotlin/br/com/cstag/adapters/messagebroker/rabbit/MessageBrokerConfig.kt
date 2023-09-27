package br.com.cstag.adapters.messagebroker.rabbit

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MessageBrokerConfig {
    @Autowired
    lateinit var rabbitTemplate: RabbitTemplate

    @Bean
    fun messageBrokerGateway() = MessageBrokerGatewayImp(rabbitTemplate)
}