package br.com.cstag.core.services.trailer

import br.com.cstag.core.entities.*
import br.com.cstag.core.gateways.Row

object TrailerFieldRetriever {
    fun retrieveFromRow(row: Row): Trailer {
        val trailer = Trailer()
        row.cells.forEach {
            try {
                when (it.index) {
                    0 -> trailer.firstLicensePlate = it.stringCellValue()
                    1 -> trailer.secondLicensePlate = it.stringCellValue()
                    2 -> trailer.thirdLicensePlate = it.stringCellValue()
                    3 -> trailer.kindOfEquipment = it.stringCellValue()
                    4 -> trailer.model = it.stringCellValue()
                    5 -> trailer.axlesTotal = getArtespId(it.stringCellValue()) ?: 0
                    6 -> trailer.axlesSuspended = getArtespId(it.stringCellValue()) ?: 0
                }
            } catch (e: Exception) {
                throw e
            }
        }
        return trailer
    }

    private fun getArtespId(categoryName: String): Int? {
        val category = ArtespCategory.list.find { it.name == categoryName }
        return category?.id
    }
}