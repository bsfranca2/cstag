package br.com.cstag.api.dto

import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.getOperatorCompany
import java.time.LocalDateTime

data class InvoiceDto(
    val number: Long,
    val issueDate: LocalDateTime,
    val operatorCompany: String,
    val progress: ProgressDto
)

data class ProgressDto(
    val isDone: Boolean,
    val percentage: Int,
)

fun Invoice.toInvoiceDto() =
    InvoiceDto(
        number = number,
        issueDate = issueDate,
        operatorCompany = this.getOperatorCompany().toString(),
        progress = ProgressDto(progress.isDone(), progress.getPercentage())
    )