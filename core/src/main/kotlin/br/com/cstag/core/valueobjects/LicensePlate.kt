package br.com.cstag.core.valueobjects

import java.io.Serializable
import javax.persistence.Embeddable

@Embeddable
data class LicensePlate(
    var value: String
) : Serializable {
    override fun toString(): String {
        return value
    }
}