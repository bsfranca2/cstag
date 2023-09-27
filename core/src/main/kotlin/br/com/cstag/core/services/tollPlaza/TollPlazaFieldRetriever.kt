package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal

object TollPlazaFieldRetriever {
    fun retrieveFromRow(row: Row): TollPlaza {
        val tollPlaza = TollPlaza()
        row.cells.forEach {
            try {
                when (it.index) {
                    1 -> tollPlaza.associateCompany = it.stringCellValue()
                    2 -> tollPlaza.metadata.setKey("entryId", it.numericCellValue().toInt())
                    3 -> tollPlaza.highway = it.stringCellValue()
                    4 -> tollPlaza.km = try {
                        it.numericCellValue().toInt().toString()
                    } catch (e: Exception) {
                        it.stringCellValue()
                    }
                    5 -> tollPlaza.fullRoadName = it.stringCellValue()
                    6 -> tollPlaza.category = it.numericCellValue().toInt()
                    8 -> tollPlaza.value = try {
                        BigDecimal.valueOf(it.numericCellValue())
                    } catch(e: Exception) {
                        BigDecimal("0")
                    }
                    9 -> tollPlaza.metadata.setKey("ticketsInNinetyDays", it.stringCellValue() == "SIM")
                }
            } catch (e: Exception) {
                throw e
            }
        }
        return tollPlaza
    }
}