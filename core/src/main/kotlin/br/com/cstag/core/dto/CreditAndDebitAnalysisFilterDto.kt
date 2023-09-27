package br.com.cstag.core.dto

import java.time.LocalDate

class CreditAndDebitAnalysisFilterDto {
    /// TODO Adicionar funcionalidade de filial
    var q = ""
    var shippingCompanyCNPJ: String? = null
    var trip: String? = null
    var licensePlate: String? = null
    var startOfPeriod: LocalDate? = null
    var endOfPeriod: LocalDate? = null
    var type: String? = null
}