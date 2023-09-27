package br.com.cstag.core.services.analyze.utils

import java.math.BigDecimal

data class SplitKm(
    val parts: List<Int>,
    val operator: String?,
    val source: String,
) {
    companion object {
        fun valueOf(km: String): SplitKm {
            var splitOperator: String? = null
            when {
                km.contains("+") -> splitOperator = "+"
                km.contains(".") -> splitOperator = "."
                km.contains(",") -> splitOperator = ","
            }
            val kmParts = if (splitOperator != null) km.split(splitOperator).map { it.trim().toInt() }
                else listOf(km.trim().toInt())
            return SplitKm(kmParts, splitOperator, km)
        }
    }

    fun toBigDecimal(): BigDecimal {
        return BigDecimal(this.parts.joinToString(separator = "."))
    }
}

fun Collection<SplitKm>.sort(): Collection<SplitKm> {
    return this.sortedWith(compareBy { it.toBigDecimal() })
}
