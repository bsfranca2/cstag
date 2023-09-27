package br.com.cstag.core.search.entities

import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.entities.TicketAnalysis
import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.Vehicle
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.Id

@Document(indexName = "ticket-analysis")
data class TicketAnalysisSearch(
    @Id
    @Field(name = "id", type = FieldType.Keyword)
    val id: Long,
    @Field(type = FieldType.Keyword)
    var shippingCompany: String?,
    @Field
    var ticket: Ticket,
    @Field
    var vehicle: Vehicle?,
    @Field
    var plaza: Plaza?,
    @Field(type = FieldType.Keyword)
    var divergenceType: String?,
    var divergenceValue: BigDecimal?
) {
    data class Ticket(
        var id: Long,
        @Field(type = FieldType.Keyword)
        var licensePlate: String?,
        var category: Int?,
        @Field(type = FieldType.Text)
        var highway: String?,
        var fare: BigDecimal?,
        var paidAt: LocalDateTime?,
        var invoiceId: Long?,
        @Field(type = FieldType.Keyword)
        var operatorCompany: String?,
        @Field(type = FieldType.Keyword)
        var type: String
    )

    data class Vehicle(
        var id: String,
        var total: Int,
        var suspended: Int,
    )

    data class Plaza(
        @Field(type = FieldType.Text)
        var fullRoadName: String,
        var value: BigDecimal,
    )
}

fun TicketAnalysis.toTicketAnalysisSearch() =
    TicketAnalysisSearch(
        id = id,
        shippingCompany = ticket.getShippingCompany()?.cnpj?.value,
        ticket = ticket.toTicketAnalyzeSearchTicket(),
        vehicle = ticket.paidAt?.let { vehicle?.toTicketAnalyzeSearchVehicle(it) },
        plaza = tollPlaza?.toTicketAnalysisSearchPlaza(),
        divergenceType = divergence?.type?.toString(),
        divergenceValue = divergence?.value
    )

fun Ticket.toTicketAnalyzeSearchTicket() =
    TicketAnalysisSearch.Ticket(
        id = id,
        licensePlate = licensePlate?.value,
        category = category,
        highway = highway,
        fare = fare,
        paidAt = paidAt,
        invoiceId = invoice?.id,
        operatorCompany = operatorCompany?.toString(),
        type = type.toString()
    )

fun Vehicle.toTicketAnalyzeSearchVehicle(date: LocalDateTime): TicketAnalysisSearch.Vehicle? {
    getAxlesRegistry(date)?.let {
        return TicketAnalysisSearch.Vehicle(licensePlate.value, it.total, it.suspended)
    }
    return null
}

fun TollPlaza.toTicketAnalysisSearchPlaza() =
    TicketAnalysisSearch.Plaza(
        fullRoadName = fullRoadName,
        value = value
    )