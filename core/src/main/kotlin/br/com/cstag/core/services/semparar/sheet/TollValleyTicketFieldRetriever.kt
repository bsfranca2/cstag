package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.Row
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime

object TollValleyTicketFieldRetriever {
    fun retrieveFromRow(row: Row): TollValleyTicketSemParar {
        val tollValleyTicket = TollValleyTicketSemParar()
        tollValleyTicket.operatorCompany = OperatorCompany.SemParar
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> tollValleyTicket.licensePlate = LicensePlate(it.stringCellValue())
                1 -> tollValleyTicket.tag = it.stringCellValue()
                3 -> tollValleyTicket.brand = it.stringCellValue()
                4 -> tollValleyTicket.category = it.stringCellValue().toInt()
                5 -> date = it.stringCellValue()
                6 -> time = it.stringCellValue()
                8 -> tollValleyTicket.highway = it.stringCellValue()
                9 -> tollValleyTicket.fare = BigDecimal.valueOf(it.numericCellValue())
                10 -> tollValleyTicket.trip = it.stringCellValue()
                11 -> tollValleyTicket.shipperName = it.stringCellValue()
                12 -> tollValleyTicket.shipperCNPJ = CNPJ(it.stringCellValue())
            }
        }

        tollValleyTicket.paidAt = getPaidAt(date, time)
        return tollValleyTicket
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