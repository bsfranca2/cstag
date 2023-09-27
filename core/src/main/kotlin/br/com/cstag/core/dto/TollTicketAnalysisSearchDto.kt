package br.com.cstag.core.dto

import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.entities.semparar.TollTicketSemParar
import br.com.cstag.core.entities.semparar.TollValleyTicketSemParar
import java.math.BigDecimal
import java.time.ZoneOffset

data class TollTicketAnalysisSearchDto(
    var analysisId: Long,
    var licensePlate: String,
    var type: String?,
    var highway: String,
    var fare: BigDecimal,
    var paidAt: Long,
    var category: Int,
    var tollPlazaHighway: String?,
    var tollPlazaValue: BigDecimal?,
    var axlesTotal: Int?,
    var axlesSuspended: Int?,
    var operatorCompany: String,
    var invoiceNumber: Long,
    var shippingCompanyCNPJ: String,
    var tollTicketType: String
)

fun TollTicketAnalysis.toTollTicketAnalysisSearchDto() =
    TollTicketAnalysisSearchDto(
        analysisId = id,
        licensePlate = tollTicket.licensePlate.value,
        type = if (divergence != null) divergence!!.type.toString() else null,
        highway = tollTicket.highway,
        fare = tollTicket.fare,
        paidAt = tollTicket.paidAt.toEpochSecond(ZoneOffset.UTC),
        category = tollTicket.category,
        tollPlazaHighway = tollPlaza?.description,
        tollPlazaValue = tollPlaza?.value,
        axlesTotal = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.total,
        axlesSuspended = vehicle?.getAxlesRegistry(tollTicket.paidAt)?.suspended,
        invoiceNumber = tollTicket.invoice.number,
        shippingCompanyCNPJ = tollTicket.invoice.shippingCompany.cnpj.value,
        operatorCompany = tollTicket.operatorCompany.toString(),
        tollTicketType = tollTicket.type.toString()
    )