package br.com.cstag.core.entities

import br.com.cstag.core.entities.semparar.InvoiceSemParar
import br.com.cstag.core.enums.OperatorCompany
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "Invoice")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "operator_company", discriminatorType = DiscriminatorType.STRING)
abstract class Invoice(
    @Id
    open var number: Long,
    open var issueDate: LocalDateTime,
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "shipping_company_id")
    open var shippingCompany: ShippingCompany,
) {
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice", orphanRemoval = true, fetch = FetchType.EAGER)
    open var tollTickets: MutableList<TollTicket> = mutableListOf()
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice", orphanRemoval = true)
    open var tollValleyCredits: MutableList<TollValleyCredit> = mutableListOf()

    @OneToOne(mappedBy = "invoice", cascade = [CascadeType.ALL], orphanRemoval = true)
    open var progress: TicketProgress = TicketProgress(this)

    fun getTollValleyTickets(): List<TollTicket> {
        return tollTickets.filter { it.type == TollTicket.Type.TollValleyTicket }
    }
}

fun Invoice.getOperatorCompany() = when(this) {
    is InvoiceSemParar -> OperatorCompany.SemParar
    else -> OperatorCompany.Undefined
}