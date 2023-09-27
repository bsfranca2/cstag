package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.MonthlyPaymentSemParar
import br.com.cstag.core.gateways.Workbook

object MonthlyDataExtraction {
    private const val MONTHLY_PAYMENT_SHEET_INDEX = 9

    fun extract(workbook: Workbook): MutableList<MonthlyPaymentSemParar> {
        val sheet = workbook.sheets.getOrNull(MONTHLY_PAYMENT_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val monthlyPaymentList = mutableListOf<MonthlyPaymentSemParar>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val monthlyPayment = MonthlyPaymentFieldRetriever.retrieveFromRow(it)
            monthlyPaymentList.add(monthlyPayment)
        }
        return monthlyPaymentList
    }
}