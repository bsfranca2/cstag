package br.com.cstag.core.services.vehicle

import br.com.cstag.core.entities.LocalDateTimeRange
import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.gateways.ExcelGateway
import br.com.cstag.core.gateways.withoutHeader
import org.slf4j.LoggerFactory
import java.io.File

class VehicleDataExtraction (
    private val period: LocalDateTimeRange,
    private val excelGateway: ExcelGateway
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    fun extract(file: File): List<Vehicle> {
        val workbook = excelGateway.read(file)
        val sheet = workbook.sheets.getOrNull(0)
            ?: throw RuntimeException("Sheet not found")
        val vehicles = mutableListOf<Vehicle>()
        val rows = sheet.rows.toMutableList().withoutHeader()
        rows.forEach {
            try {
                val retriever = VehicleFieldRetriever(period)
                val vehicle = retriever.retrieveFromRow(it)
                vehicles.add(vehicle)
            } catch (e: Exception) {
                logger.error("Erro na linha " + rows.indexOf(it))
                throw e
            }
        }
        return vehicles.filter { it.licensePlate.value.isNotEmpty() }
    }
}