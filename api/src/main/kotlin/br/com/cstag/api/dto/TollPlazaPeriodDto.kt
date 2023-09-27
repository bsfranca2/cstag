package br.com.cstag.api.dto

import br.com.cstag.core.entities.TollPlazaPeriod
import java.time.LocalDate

data class TollPlazaPeriodDto(
    val id: Int,
    val startOfPeriod: LocalDate,
    val endOfPeriod: LocalDate?,
    val status: String,
)

fun TollPlazaPeriod.toTollPlazaPeriodDto() =
    TollPlazaPeriodDto(
        id = id,
        startOfPeriod = startOfPeriod,
        endOfPeriod = endOfPeriod,
        status = status.toString()
    )