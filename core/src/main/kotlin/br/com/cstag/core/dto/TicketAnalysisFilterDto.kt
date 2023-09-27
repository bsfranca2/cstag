package br.com.cstag.core.dto

import java.time.LocalDate

class TicketAnalysisFilterDto {
    /// TODO Adicionar funcionalidade de filial
    var shippingCompanyCNPJ: String? = null
    var invoiceNumber: Long? = null
    var licensePlate: String? = null
    var divergence: String? = null
    var startOfPeriod: LocalDate? = null
    var endOfPeriod: LocalDate? = null
    var operatorCompany: String? = null
    var term: String? = null
    var ticketType: String? = null
}