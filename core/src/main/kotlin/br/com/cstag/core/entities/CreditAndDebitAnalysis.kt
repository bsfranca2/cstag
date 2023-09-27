package br.com.cstag.core.entities

import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "credit_and_debit_analyzes")
data class CreditAndDebitAnalysis(
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "shipping_company_id", nullable = false)
    val shippingCompany: ShippingCompany,
    val trip: String,
) {
    enum class Divergence {
        Debit, Credit
    }

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
    @Enumerated(EnumType.STRING)
    var divergence: Divergence? = null

    @OneToMany
    var creditList = listOf<TollValleyCredit>()
    @OneToMany
    var ticketList = listOf<Ticket>()
}