package br.com.cstag.api.dto

import br.com.cstag.core.entities.TollValleyCredit
import java.math.BigDecimal
import java.time.LocalDateTime

data class TollValleyCreditDto(
    var id: Long = -1,
    var trip: String? = null,
    var value: BigDecimal? = null,
    var licensePlate: String? = null,
    var metadata: Map<String, String> = mapOf(),
    var operatorCompany: String? = null,
    var receivedAt: LocalDateTime? = null,
    var source: String? = null,
    var invoiceIdentifier: String? = null
)

fun TollValleyCredit.toTollValleyCreditDto() =
    TollValleyCreditDto(
        id = id,
        trip = trip,
        value = value,
        licensePlate = licensePlate?.value,
        metadata = metadata.data,
        operatorCompany = operatorCompany?.toString(),
        receivedAt = receivedAt,
        source = source?.toString(),
        invoiceIdentifier = invoice?.identifier
    )