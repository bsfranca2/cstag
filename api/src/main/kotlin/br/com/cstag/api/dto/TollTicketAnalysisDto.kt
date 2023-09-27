package br.com.cstag.api.dto

import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.entities.semparar.TollTicketSemParar
import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import br.com.cstag.core.enums.OperatorCompany
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime

data class TollTicketAnalysisDto(
    val id: Long,
    val paidAt: LocalDateTime,
    val highway: String,
    val fare: BigDecimal,
    val tag: String?,
    val licensePlate: String,
    val category: Int,
    val operatorCompany: OperatorCompany,
    val tollPlazaDescription: String?,
    val tollPlazaCategory: Int?,
    val tollPlazaValue: BigDecimal?,
    val tollPlazaAssociateCompany: String?,
    val tollPlazaStartOfPeriod: LocalDate?,
    val tollPlazaEndOfPeriod: LocalDate?,
    val tollPlazaEntryId: Int?,
    val vehicleLicensePlate: String?,
    val vehicleBrand: String?,
    val vehicleTotal: Int?,
    val vehicleSuspended: Int?,
    val vehicleStartOfPeriod: Instant?,
    val vehicleEndOfPeriod: Instant?
)

fun TollTicketAnalysis.toTollTicketAnalysisDto() =
    TollTicketAnalysisDto(
        id = id,
        paidAt = tollTicket.paidAt,
        highway = tollTicket.highway,
        fare = tollTicket.fare,
        tag = when(tollTicket) {
            is TollTicketSemParar -> (tollTicket as TollTicketSemParar).tag
            is TollValleyTicketSemParar -> (tollTicket as TollValleyTicketSemParar).tag
            else -> null
        },
        licensePlate =  tollTicket.licensePlate.value,
        category = tollTicket.category,
        operatorCompany = tollTicket.operatorCompany,
        tollPlazaDescription = tollPlaza?.description,
        tollPlazaCategory = tollPlaza?.category,
        tollPlazaValue = tollPlaza?.value,
        tollPlazaAssociateCompany = tollPlaza?.associateCompKnownName,
        tollPlazaStartOfPeriod = tollPlaza?.period?.startOfPeriod,
        tollPlazaEndOfPeriod = tollPlaza?.period?.endOfPeriod,
        tollPlazaEntryId = tollPlaza?.entryId,
        vehicleLicensePlate = vehicle?.licensePlate?.value,
        vehicleBrand = vehicle?.brand,
        vehicleTotal = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.total,
        vehicleSuspended = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.suspended,
        vehicleStartOfPeriod = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.period?.startAt,
        vehicleEndOfPeriod = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.period?.endAt,
    )