package br.com.cstag.core.search.entities

import br.com.cstag.core.entities.CreditAndDebitAnalysis
import br.com.cstag.core.enums.OperatorCompany
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.Id

@Document(indexName = "credit-debit-analysis")
data class CreditAndDebitAnalysisSearch(
    @Id
    var id: Long,
    @Field(type = FieldType.Keyword)
    var shippingCompanyCNPJ: String,
    @Field(type = FieldType.Keyword)
    var trip: String,
    @Field(type = FieldType.Keyword)
    var licensePlate: String?,
    var numberOfTransactions: Int,
    var totalOfDebit: BigDecimal,
    var totalOfCredit: BigDecimal,
    var differenceOfValue: BigDecimal,
    @Field(type = FieldType.Keyword)
    var divergence: String?,
    var startOfPeriod: LocalDateTime?,
    var endOfPeriod: LocalDateTime?,
)

fun CreditAndDebitAnalysis.toCreditAndDebitAnalysisSearch() =
    CreditAndDebitAnalysisSearch(
        id,
        shippingCompany.cnpj.value,
        trip,
        licensePlate?.value,
        numberOfTransactions,
        totalOfDebit,
        totalOfCredit,
        differenceOfValue,
        divergence?.toString(),
        startOfPeriod,
        endOfPeriod,
    )