package br.com.cstag.core.services.invoice.semparar

import br.com.cstag.core.entities.MonthlyPayment
import br.com.cstag.core.gateways.Row
import java.math.BigDecimal

object MonthlyPaymentFieldRetriever {
    fun retrieveFromRow(row: Row): MonthlyPayment {
        val monthlyPayment = MonthlyPayment.Builder()
        row.cells.forEach {
            when (it.index) {
                0 -> monthlyPayment.licensePlate = it.stringCellValue()
                1 -> monthlyPayment.tag = it.stringCellValue()
                3 -> monthlyPayment.metadata.setKey("category", it.stringCellValue().toInt())
                4 -> {
                    val (month, year) = getDate(it.stringCellValue())
                    monthlyPayment.month = month
                    monthlyPayment.year = year
                }
                5 -> monthlyPayment.value = BigDecimal.valueOf(it.numericCellValue())
            }
        }
        return monthlyPayment.build()
    }

    private fun getDate(ref: String): DateReference {
        val parts = ref.split("/")
        val month = parts[0].toInt()
        val year = parts[1].toInt()
        return DateReference(month, year)
    }

    private data class DateReference(
        val month: Int,
        val year: Int,
    )
}