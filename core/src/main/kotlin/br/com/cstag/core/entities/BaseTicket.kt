package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime

interface BaseTicket {
    var id: Long
    var highway: String
    var licensePlate: LicensePlate
    var category: Int
    var fare: BigDecimal
    var paidAt: LocalDateTime
    var status: TollRegistryStatus
    var operatorCompany: OperatorCompany
    var analysis: TollTicketAnalysis?
    var invoice: Invoice
}