package br.com.cstag.core.dto

data class InvoiceSheetMessageDto(
    val invoiceId: Long,
    val bucketName: String,
    val objectName: String
)