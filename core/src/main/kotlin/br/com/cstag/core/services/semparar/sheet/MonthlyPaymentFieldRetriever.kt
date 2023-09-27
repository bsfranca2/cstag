package br.com.cstag.core.services.semparar.sheet

import br.com.cstag.core.entities.semparar.MonthlyPaymentSemParar
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal
import java.time.LocalDate

object MonthlyPaymentFieldRetriever {
    fun retrieveFromRow(row: Row): MonthlyPaymentSemParar {
        val monthlyPayment = MonthlyPaymentSemParar()
        row.cells.forEach {
            when (it.index) {
                0 -> monthlyPayment.licensePlate = it.stringCellValue()
                1 -> monthlyPayment.tag = it.stringCellValue()
                3 -> monthlyPayment.cat = it.stringCellValue().toInt()
                4 -> monthlyPayment.ref = getDate(it.stringCellValue())
                5 -> monthlyPayment.value = BigDecimal.valueOf(it.numericCellValue())
            }
        }
        monthlyPayment.year = monthlyPayment.ref?.year
        monthlyPayment.month = monthlyPayment.ref?.monthValue
        return monthlyPayment
    }

    private fun getDate(ref: String): LocalDate {
        val parts = ref.split("/")
        val month = parts[0].toInt()
        val year = parts[1].toInt()
        return LocalDate.of(year, month, 1)
    }
}