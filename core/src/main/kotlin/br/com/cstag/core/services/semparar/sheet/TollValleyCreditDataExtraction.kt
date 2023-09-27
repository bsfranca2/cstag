package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.Workbook
import java.io.File

object TollValleyCreditDataExtraction {
    private const val TOLL_VALLEY_CREDIT_SHEET_INDEX = 11

    fun extract(workbook: Workbook): MutableList<TollValleyCreditSemParar> {
        val sheet = workbook.sheets.getOrNull(TOLL_VALLEY_CREDIT_SHEET_INDEX)
            ?: throw RuntimeException("Sheet not found")
        val tollValleyCredits = mutableListOf<TollValleyCreditSemParar>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            val tollValleyCredit = TollValleyCreditFieldRetriever.retrieveFromRow(it)
            tollValleyCredits.add(tollValleyCredit)
        }
        return tollValleyCredits
    }
}