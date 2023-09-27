package br.com.cstag.core.entities.semparar

import br.com.cstag.core.entities.Invoice
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.*

@Entity
@Table(name = "monthly_payments_sem_parar")
class MonthlyPaymentSemParar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    var licensePlate: String? = null
    var tag: String? = null
    var cat: Int? = null
    var ref: LocalDate? = null
    var value: BigDecimal? = null
    var month: Int? = null
    var year: Int? = null
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id")
    lateinit var invoice: Invoice
}
