package br.com.cstag.core.dto.messages

data class InvoiceSheetMessageDto(
    val invoiceId: Long,
    val bucketName: String,
    val objectName: String
)