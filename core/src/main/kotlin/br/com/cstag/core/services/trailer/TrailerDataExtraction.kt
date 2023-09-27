package br.com.cstag.core.services.trailer

import br.com.cstag.core.entities.Trailer
import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.withoutHeader
import org.slf4j.LoggerFactory
import java.io.File

class TrailerDataExtraction (
    private val excelGateway: ExcelGateway
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    fun extract(file: File): List<Trailer> {
        val workbook = excelGateway.read(file)
        val sheet = workbook.sheets.getOrNull(0)
            ?: throw RuntimeException("Sheet not found")
        val trailers = mutableListOf<Trailer>()
        val rows = sheet.rows.toMutableList().withoutHeader()
        rows.forEach {
            try {
                val trailer = TrailerFieldRetriever.retrieveFromRow(it)
                trailers.add(trailer)
            } catch (e: Exception) {
                logger.error("Erro na linha " + rows.indexOf(it))
                throw e
            }
        }
        return trailers.filter { it.firstLicensePlate != null && it.firstLicensePlate!!.isNotEmpty() }
    }
}