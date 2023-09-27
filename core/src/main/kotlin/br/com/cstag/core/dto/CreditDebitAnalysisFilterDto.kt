package br.com.cstag.core.dto

import java.time.LocalDate

class CreditDebitAnalysisFilterDto {
    /// TODO Adicionar funcionalidade de filial
    var shippingCompanyCNPJ: String? = null
    var trip: String? = null
    var licensePlate: String? = null
    var divergence: String? = null
    var startOfPeriod: LocalDate? = null
    var endOfPeriod: LocalDate? = null
}