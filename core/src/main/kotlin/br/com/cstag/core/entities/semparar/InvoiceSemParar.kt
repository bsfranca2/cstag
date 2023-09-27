package br.com.cstag.core.entities.semparar

import br.com.cstag.core.entities.Invoice
import br.com.cstag.core.entities.ShippingCompany
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "InvoiceSemParar")
@Table(name = "invoice_sem_parar")
@DiscriminatorValue("InvoiceSemParar")
class InvoiceSemParar(
    number: Long,
    issueDate: LocalDateTime,
    shippingCompany: ShippingCompany
) : Invoice(number, issueDate, shippingCompany) {
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice")
    var monthlyPayments: MutableList<MonthlyPaymentSemParar> = mutableListOf()
//    @OneToMany(cascade = [CascadeType.ALL])
//    var otherServices: MutableList<OtherServiceSemPararEntity> = mutableListOf()
}