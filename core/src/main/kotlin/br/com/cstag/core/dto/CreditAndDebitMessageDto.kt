package br.com.cstag.core.dto

data class CreditAndDebitMessageDto(
    val shippingCompanyCNPJ: String,
    val trip: String,
    val invoiceId: Long? = null
)