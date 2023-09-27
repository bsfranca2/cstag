package br.com.cstag.api.dto

import br.com.cstag.core.entities.Metadata
import br.com.cstag.core.entities.TicketAnalysis
import br.com.cstag.core.enums.OperatorCompany
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class TicketAnalysisDto(
    val id: Long,
    val paidAt: LocalDateTime?,
    val highway: String?,
    val fare: BigDecimal?,
    val licensePlate: String?,
    val category: Int?,
    val operatorCompany: OperatorCompany?,
    val metadata: Metadata?,
    val tollPlazaFullRoadName: String?,
    val tollPlazaCategory: Int?,
    val tollPlazaValue: BigDecimal?,
    val tollPlazaAssociateCompany: String?,
    val tollPlazaStartOfPeriod: LocalDate?,
    val tollPlazaEndOfPeriod: LocalDate?,
    val tollPlazaMetadata: Metadata?,
    val vehicleLicensePlate: String?,
    val vehicleBrand: String?,
    val vehicleTotal: Int?,
    val vehicleSuspended: Int?,
    val vehicleStartOfPeriod: LocalDateTime?,
    val vehicleEndOfPeriod: LocalDateTime?
)

fun TicketAnalysis.toTollTicketAnalysisDto() =
    TicketAnalysisDto(
        id = id,
        paidAt = ticket.paidAt,
        highway = ticket.highway,
        fare = ticket.fare,
        licensePlate =  ticket.licensePlate?.value,
        category = ticket.category,
        operatorCompany = ticket.operatorCompany,
        metadata = ticket.metadata,
        tollPlazaFullRoadName = tollPlaza?.fullRoadName,
        tollPlazaCategory = tollPlaza?.category,
        tollPlazaValue = tollPlaza?.value,
        tollPlazaAssociateCompany = tollPlaza?.associateCompany,
        tollPlazaStartOfPeriod = tollPlaza?.period?.startOfPeriod,
        tollPlazaEndOfPeriod = tollPlaza?.period?.endOfPeriod,
        tollPlazaMetadata = tollPlaza?.metadata,
        vehicleLicensePlate = vehicle?.licensePlate?.value,
        vehicleBrand = vehicle?.brand,
        vehicleTotal = ticket.paidAt?.let { vehicle?.getAxlesRegistry(it)?.total },
        vehicleSuspended = ticket.paidAt?.let { vehicle?.getAxlesRegistry(it)?.suspended },
        vehicleStartOfPeriod = ticket.paidAt?.let { vehicle?.getAxlesRegistry(it)?.period?.startAt },
        vehicleEndOfPeriod = ticket.paidAt?.let { vehicle?.getAxlesRegistry(it)?.period?.endAt }
    )