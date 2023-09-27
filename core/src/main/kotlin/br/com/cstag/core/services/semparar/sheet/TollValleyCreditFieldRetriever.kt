package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.TollValleyCreditSemParar
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.gateways.Row
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime


object TollValleyCreditFieldRetriever {
    fun retrieveFromRow(row: Row): TollValleyCreditSemParar {
        val tollValleyCredit = TollValleyCreditSemParar()
        var date = ""
        var time = ""

        row.cells.forEach {
            when (it.index) {
                0 -> tollValleyCredit.licensePlate = LicensePlate(it.stringCellValue())
                1 -> tollValleyCredit.tag = it.stringCellValue()
                2 -> date = it.stringCellValue()
                3 -> time = it.stringCellValue()
                4 -> tollValleyCredit.description = it.stringCellValue()
                5 -> tollValleyCredit.trip = it.stringCellValue()
                7 -> tollValleyCredit.value = BigDecimal.valueOf(it.numericCellValue())
                8 -> tollValleyCredit.shipperName = it.stringCellValue()
                9 -> tollValleyCredit.shipperCNPJ = CNPJ(it.stringCellValue())
            }
        }

        tollValleyCredit.operatorCompany = OperatorCompany.SemParar
        tollValleyCredit.receivedAt = getReceivedAt(date, time)
        return tollValleyCredit
    }

    private fun getReceivedAt(date: String, time: String): LocalDateTime {
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