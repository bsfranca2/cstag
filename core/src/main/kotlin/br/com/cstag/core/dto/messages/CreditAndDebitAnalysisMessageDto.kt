package br.com.cstag.core.dto.messages

data class CreditAndDebitAnalysisMessageDto(
    val shippingCompanyId: String,
    val trip: String,
    val invoiceId: Long? = null
)