package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.gateways.Workbook
import java.math.BigDecimal
import java.time.LocalDateTime

object InvoiceDataExtraction {
    private const val INVOICE_SUMMARY_SHEET_INDEX = 0

    fun extract(workbook: Workbook): InvoiceExtracted {
        val sheet = workbook.sheets.getOrNull(INVOICE_SUMMARY_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val invoiceNumber = BigDecimal(sheet.rows[1].cells[1].numericCellValue()).toPlainString()
        val invoiceDateOfIssue = sheet.rows[3].cells[1].localDateTimeValue()

        return InvoiceExtracted(invoiceNumber.toLong(), invoiceDateOfIssue)
    }

    data class InvoiceExtracted(
        val number: Long,
        val dateOfIssue: LocalDateTime
    )
}