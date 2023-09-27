package br.com.cstag.core.entities

import java.io.Serializable
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import javax.persistence.Embeddable

@Embeddable
data class LocalDateRange(
    var startAt: LocalDate,
    var endAt: LocalDate? = null,
) : Serializable

@Embeddable
data class LocalDateTimeRange(
    var startAt: LocalDateTime,
    var endAt: LocalDateTime? = null,
) : Serializable {
    constructor(startAt: Instant, endAt: Instant?): this(
        startAt.atZone(ZoneId.systemDefault()).toLocalDateTime(),
        endAt?.atZone(ZoneId.systemDefault())?.toLocalDateTime()
    )
}

@Embeddable
data class InstantRange(
    var startAt: Instant,
    var endAt: Instant? = null,
) : Serializable