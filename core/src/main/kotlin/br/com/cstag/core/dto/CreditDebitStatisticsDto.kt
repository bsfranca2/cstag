package br.com.cstag.core.dto

import java.math.BigDecimal

data class CreditDebitStatisticsDto(
    var totalOfDebit: BigDecimal = BigDecimal.ZERO,
    var totalOfCredit: BigDecimal = BigDecimal.ZERO,
    var numberOfAnalyzes: Long = 0L
) {
    val totalOfDifference: BigDecimal
        get() {
            if (totalOfDebit > totalOfCredit)
                return totalOfDebit - totalOfCredit
            return totalOfCredit - totalOfDebit
        }
}