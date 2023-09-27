package br.com.cstag.core.entities

import java.io.Serializable
import java.time.LocalDate
import javax.persistence.Embeddable

@Embeddable
data class LocalDateRange(
    var startAt: LocalDate,
    var endAt: LocalDate? = null,
) : Serializable