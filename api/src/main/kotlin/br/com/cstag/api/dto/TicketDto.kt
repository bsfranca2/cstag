package br.com.cstag.api.dto

import br.com.cstag.core.entities.Ticket
import java.math.BigDecimal
import java.time.LocalDateTime

data class TicketDto(
    val id: Long,
    val paidAt: LocalDateTime?,
    val highway: String?,
    val fare: BigDecimal?,
    val licensePlate: String?,
    val category: Int?,
    val operatorCompany: String?,
    val metadata: Map<String, String>,
)


fun Ticket.toTicketDto() =
    TicketDto(
        id = id,
        paidAt = paidAt,
        highway = highway,
        fare = fare,
        licensePlate = licensePlate?.value,
        category = category,
        operatorCompany = operatorCompany?.toString(),
        metadata = metadata.data
    )