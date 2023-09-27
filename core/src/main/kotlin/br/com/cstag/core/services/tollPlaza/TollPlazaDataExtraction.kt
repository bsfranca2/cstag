package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.gateways.ExcelGateway
import java.io.File

class TollPlazaDataExtraction (
    private val excelGateway: ExcelGateway
) {
    fun extract(file: File): MutableList<TollPlaza> {
        val workbook = excelGateway.read(file)
        val sheet = workbook.sheets.getOrNull(0)
            ?: throw RuntimeException("Sheet not found")
        val tollPlazas = mutableListOf<TollPlaza>()
        val rows = sheet.rows.toMutableList()
        rows.removeFirst() // Remove header
        rows.forEach {
            try {
                val tollPlaza = TollPlazaFieldRetriever.retrieveFromRow(it)
                tollPlaza?.let { tollPlazas.add(it) }
            } catch (e: Exception) {
                println("Erro na linha " + rows.indexOf(it))
                throw e
            }
        }
        return tollPlazas
    }
}