package br.com.cstag.api.dto

import java.math.BigDecimal

class MonthlyPaymentDto(
    val licensePlate: String,
    val category: Int
) {
    var january: BigDecimal? = null
    var february: BigDecimal? = null
    var march: BigDecimal? = null
    var april: BigDecimal? = null
    var may: BigDecimal? = null
    var june: BigDecimal? = null
    var july: BigDecimal? = null
    var august: BigDecimal? = null
    var september: BigDecimal? = null
    var october: BigDecimal? = null
    var november: BigDecimal? = null
    var december: BigDecimal? = null
}
