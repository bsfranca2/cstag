package br.com.cstag.api.dto

import br.com.cstag.core.entities.LocalDateRange
import java.time.LocalDate

data class LocalDateRangeDto(
    val startOfPeriod: LocalDate,
    val endOfPeriod: LocalDate? = null
)

fun LocalDateRangeDto.toLocalDateRange() =
    LocalDateRange(startOfPeriod, endOfPeriod)