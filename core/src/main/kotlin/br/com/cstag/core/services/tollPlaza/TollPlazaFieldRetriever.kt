package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal

object TollPlazaFieldRetriever {
    fun retrieveFromRow(row: Row): TollPlaza? {
        val tollPlaza = TollPlaza()
        var ticketInNinetyDays = false
        row.cells.forEach {
            try {
                when (it.index) {
                    0 -> tollPlaza.associateId = it.numericCellValue().toLong()
                    1 -> tollPlaza.associateCompKnownName = it.stringCellValue()
                    2 -> tollPlaza.entryId = it.numericCellValue().toInt()
                    3 -> tollPlaza.roadCode = it.stringCellValue()
                    4 -> tollPlaza.km = try {
                        it.numericCellValue().toInt().toString()
                    } catch (e: Exception) {
                        it.stringCellValue()
                    }
                    5 -> tollPlaza.description = it.stringCellValue()
                    6 -> tollPlaza.category = it.numericCellValue().toInt()
                    8 -> tollPlaza.value = try {
                        BigDecimal.valueOf(it.numericCellValue())
                    } catch(e: Exception) {
                        BigDecimal("0")
                    }
                    9 -> ticketInNinetyDays = it.stringCellValue() == "SIM"
                }
            } catch (e: Exception) {
                throw e
            }
        }
        if (!ticketInNinetyDays) return null
        return tollPlaza
    }
}