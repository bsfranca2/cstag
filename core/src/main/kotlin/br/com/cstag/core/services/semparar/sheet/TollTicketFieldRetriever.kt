package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollTicketSemParar
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.Row
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime

object TollTicketFieldRetriever {
    fun retrieveFromRow(row: Row): TollTicketSemParar {
        val tollTicket = TollTicketSemParar()
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> tollTicket.licensePlate = LicensePlate(it.stringCellValue())
                1 -> tollTicket.tag = it.stringCellValue()
                3 -> tollTicket.brand = it.stringCellValue()
                4 -> tollTicket.category = it.stringCellValue().toInt()
                5 -> date = it.stringCellValue()
                6 -> time = it.stringCellValue()
                8 -> tollTicket.highway = it.stringCellValue()
                9 -> tollTicket.fare = BigDecimal.valueOf(it.numericCellValue())
            }
        }

        tollTicket.paidAt = getPaidAt(date, time)
        tollTicket.operatorCompany = OperatorCompany.SemParar
        return tollTicket
    }

    private fun getPaidAt(date: String, time: String): LocalDateTime {
        try {
            date.let {
                time.let { time ->
                    val (day, month, year) = date.split("/").map { it.toInt() }
                    val (hour, minute) = time.split(":").map { it.toInt() }
                    return LocalDateTime.of(year, month, day, hour, minute)
                }
            }
        } catch(e: Exception) {
            throw RuntimeException("Error creating date")
        }
    }
}