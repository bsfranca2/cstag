package br.com.cstag.core.services.vehicle

import br.com.cstag.core.entities.*
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal

class VehicleFieldRetriever(
    private val period: LocalDateTimeRange
) {

    fun retrieveFromRow(row: Row): Vehicle {
        var vehicle: Vehicle? = null
        var axlesRegistryTotal = 0
        var axlesRegistrySuspended = 0
        var clientRegistryClient: String? = ""
        var clientRegistrySegment: String? = ""
        row.cells.forEach {
            try {
                when (it.index) {
                    0 -> vehicle = Vehicle(LicensePlate(it.stringCellValue()))
                    1 -> vehicle?.description = it.stringCellValue()
                    2 -> vehicle?.brand = it.stringCellValue()
                    3 -> vehicle?.model = try {
                        it.stringCellValue()
                    } catch (e: Exception) {
                        it.numericCellValue().toInt().toString()
                    }
                    4 -> vehicle?.year = try {
                        it.numericCellValue().toInt()
                    } catch (e: Exception) {
                        it.stringCellValue().toIntOrNull()
                    }
                    5 -> axlesRegistryTotal = getArtespId(it.stringCellValue()) ?: 0
                    6 -> axlesRegistrySuspended = getArtespId(it.stringCellValue()) ?: 0
                    7 -> clientRegistryClient = it.stringCellValue() // Cliente
                    8 -> clientRegistrySegment = it.stringCellValue() // Segmneto
                    // 9 -> Operação
                }
            } catch (e: Exception) {
                throw e
            }
        }
        vehicle?.let {
            val axlesRegistry = Vehicle.AxlesRegistry(
                total = axlesRegistryTotal,
                suspended = axlesRegistrySuspended,
                period = period
            )
            axlesRegistry.vehicle = it
            it.axlesRegistries.add(axlesRegistry)
            val clientRegistry = Vehicle.ClientRegistry(
                client = clientRegistryClient,
                segment = clientRegistrySegment,
                group = null,
                subgroup = null,
                period = period,
            )
            clientRegistry.vehicle = it
            it.clientRegistries.add(clientRegistry)
            return it
        }
        throw RuntimeException("Placa não encontrada")
    }

    private fun getArtespId(categoryName: String): Int? {
        val category = ArtespCategory.list.find { it.name == categoryName }
        return category?.id
    }
}