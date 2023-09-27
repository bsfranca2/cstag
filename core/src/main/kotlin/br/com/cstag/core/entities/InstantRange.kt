package br.com.cstag.core.entities

import java.io.Serializable
import java.time.Instant
import javax.persistence.Embeddable

@Embeddable
data class InstantRange(
    var startAt: Instant,
    var endAt: Instant? = null,
) : Serializable