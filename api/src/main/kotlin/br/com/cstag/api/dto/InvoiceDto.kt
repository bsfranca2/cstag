package br.com.cstag.api.dto

import br.com.cstag.core.entities.Invoice

data class InvoiceDto(
    val identifier: String,
    val operatorCompany: String,
    val metadata: Map<String, String>,
    val progress: ProgressDto,
)

data class ProgressDto(
    val isDone: Boolean,
    val percentage: Int,
)

fun Invoice.toInvoiceDto() =
    InvoiceDto(
        identifier = identifier,
        operatorCompany = operatorCompany.toString(),
        metadata = metadata.data,
        progress = ProgressDto(progress.isDone(), progress.getPercentage())
    )