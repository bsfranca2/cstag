package br.com.cstag.core.valueobjects

import java.io.Serializable
import javax.persistence.AttributeOverride
import javax.persistence.Column
import javax.persistence.Embeddable

@Embeddable
class CNPJ(
    valueUnformatted: String,
) : Serializable {
    var value: String = getOnlyNumbers(valueUnformatted)

    private fun getOnlyNumbers(value: String): String {
        return value.replace("\\D+".toRegex(), "")
    }
}