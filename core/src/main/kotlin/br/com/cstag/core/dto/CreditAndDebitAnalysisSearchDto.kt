package br.com.cstag.core.dto

import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.enums.OperatorCompany
import java.math.BigDecimal
import java.time.ZoneOffset

data class CreditAndDebitAnalysisSearchDto(
    var analysisId: Long,
    var shippingCompanyCNPJ: String,
    var trip: String,
    var licensePlate: String?,
    var numberOfTransactions: Int,
    var totalOfDebit: BigDecimal,
    var totalOfCredit: BigDecimal,
    var differenceOfValue: BigDecimal,
    var divergenceType: String? = null,
    var startOfPeriod: Long?,
    var endOfPeriod: Long?,
)

fun CreditAndDebitAnalysis.toCreditAndDebitAnalysisSearchDto() =
    CreditAndDebitAnalysisSearchDto(
        id,
        shippingCompany.cnpj.value,
        trip,
        licensePlate?.value,
        numberOfTransactions,
        totalOfDebit,
        totalOfCredit,
        differenceOfValue,
        if (divergence != null) divergence!!.type.toString() else null,
        startOfPeriod?.toEpochSecond(ZoneOffset.UTC),
        endOfPeriod?.toEpochSecond(ZoneOffset.UTC),
    )