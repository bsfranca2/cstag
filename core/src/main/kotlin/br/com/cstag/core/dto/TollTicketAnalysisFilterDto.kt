package br.com.cstag.core.dto

import java.time.LocalDate

class TollTicketAnalysisFilterDto {
    /// TODO Adicionar funcionalidade de filial
    var q = ""
    var licensePlate: String? = null
    var type: String? = null
    var invoiceNumber: Long? = null
    var startOfPeriod: LocalDate? = null
    var endOfPeriod: LocalDate? = null
    var operatorCompany: String? = null
    var tollTicketType: String? = null
    var shippingCompanyCNPJ: String? = null
}