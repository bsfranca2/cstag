package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.MonthlyPayment
import br.com.cstag.core.gateways.Workbook

object MonthlyPaymentDataExtraction {
    private const val MONTHLY_PAYMENT_SHEET_INDEX = 9

    fun extract(workbook: Workbook): MutableList<MonthlyPayment> {
        val sheet = workbook.sheets.getOrNull(MONTHLY_PAYMENT_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val monthlyPaymentList = mutableListOf<MonthlyPayment>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val monthlyPayment = MonthlyPaymentFieldRetriever.retrieveFromRow(it)
            monthlyPaymentList.add(monthlyPayment)
        }
        return monthlyPaymentList
    }
}