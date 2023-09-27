package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.withoutHeader
import org.slf4j.LoggerFactory
import java.io.File

class TollPlazaDataExtraction (
    private val excelGateway: ExcelGateway
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    fun extract(file: File): MutableList<TollPlaza> {
        val workbook = excelGateway.read(file)
        val sheet = workbook.sheets.getOrNull(0)
            ?: throw RuntimeException("Sheet not found")
        val tollPlazas = mutableListOf<TollPlaza>()
        val rows = sheet.rows.toMutableList().withoutHeader()
        rows.forEach {
            try {
                val tollPlaza = TollPlazaFieldRetriever.retrieveFromRow(it)
                val ticketsInNinetyDays = tollPlaza.metadata.getValue("ticketsInNinetyDays")
                if (ticketsInNinetyDays == "true") {
                    tollPlaza.metadata.removeKey("ticketsInNinetyDays")
                    tollPlazas.add(tollPlaza)
                }
            } catch (e: Exception) {
                logger.error("Erro na linha " + rows.indexOf(it))
                throw e
            }
        }
        return tollPlazas
    }
}