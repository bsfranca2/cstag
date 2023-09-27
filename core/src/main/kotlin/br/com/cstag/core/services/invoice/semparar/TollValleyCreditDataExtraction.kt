package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.TollValleyCredit
import br.com.cstag.core.gateways.Workbook

object TollValleyCreditDataExtraction {
    private const val TOLL_VALLEY_CREDIT_SHEET_INDEX = 11

    fun extract(workbook: Workbook): MutableList<TollValleyCredit> {
        val sheet = workbook.sheets.getOrNull(TOLL_VALLEY_CREDIT_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val tollValleyCredits = mutableListOf<TollValleyCredit>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val tollValleyCredit = TollValleyCreditFieldRetriever.retrieveFromRow(it)
            tollValleyCredits.add(tollValleyCredit)
        }
        return tollValleyCredits
    }
}