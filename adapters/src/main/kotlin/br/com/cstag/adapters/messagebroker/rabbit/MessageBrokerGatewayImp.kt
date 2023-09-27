package br.com.cstag.adapters.messagebroker.rabbit

import br.com.cstag.core.gateways.MessageBrokerGateway
import org.springframework.amqp.rabbit.core.RabbitTemplate

class MessageBrokerGatewayImp(
    private val rabbitTemplate: RabbitTemplate
) : MessageBrokerGateway {
    override fun <T> sendToExchange(exchange: String, routingKey: String, obj: T, clazz: Class<T>) {
        val objSerialized = SerializationUtil.serialize(obj, clazz)
        rabbitTemplate.convertAndSend(exchange, routingKey, objSerialized)
    }
}