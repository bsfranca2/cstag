package br.com.cstag.core.gateways

interface MessageBrokerGateway {
    fun <T> sendToExchange(exchange: String, routingKey: String, obj: T, clazz: Class<T>)
}