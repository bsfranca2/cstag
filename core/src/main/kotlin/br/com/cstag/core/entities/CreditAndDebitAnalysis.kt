package br.com.cstag.core.entities

import br.com.cstag.core.enums.DivergenceStatus
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
import java.io.Serializable
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "credit_and_debit_analyzes")
data class CreditAndDebitAnalysis(
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "shipping_company_id", nullable = false)
    val shippingCompany: ShippingCompany,
    @Column(nullable = false)
    val trip: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    var differenceOfValue: BigDecimal = BigDecimal.ZERO
    var totalOfCredit: BigDecimal = BigDecimal.ZERO
    var totalOfDebit: BigDecimal = BigDecimal.ZERO
    var numberOfTransactions: Int = 0
    var licensePlate: LicensePlate? = null
    var startOfPeriod: LocalDateTime? = null
    var endOfPeriod: LocalDateTime? = null
    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "type", column = Column(name = "divergenceType")),
        AttributeOverride(name = "status", column = Column(name = "divergenceStatus"))
    )
    var divergence: CreditAndDebitAnalysisDivergence? = null
}

@Embeddable
data class CreditAndDebitAnalysisDivergence(
    @Enumerated(EnumType.STRING)
    var type: Type,
    @Enumerated(EnumType.STRING)
    var status: DivergenceStatus,
) : Serializable {
    enum class Type {
        Debit, Credit
    }
}