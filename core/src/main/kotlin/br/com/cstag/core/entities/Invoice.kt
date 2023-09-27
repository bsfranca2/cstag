package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.mappers.MetadataConverter
import javax.persistence.*

@Entity
@Table(name = "invoices")
data class Invoice(
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "shipping_company_id")
    var shippingCompany: ShippingCompany,
    var identifier: String,
    @Enumerated(EnumType.STRING)
    var operatorCompany: OperatorCompany,
    @Convert(converter = MetadataConverter::class)
    @Column(columnDefinition = "TEXT")
    var metadata: Metadata,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice", orphanRemoval = true)
    var tickets: MutableList<Ticket> = mutableListOf()
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice", orphanRemoval = true)
    var credits: MutableList<TollValleyCredit> = mutableListOf()
    @OneToOne(mappedBy = "invoice", cascade = [CascadeType.ALL], orphanRemoval = true)
    var progress: Progress = Progress(this)

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "invoice", orphanRemoval = true)
    var monthlyPayments: MutableList<MonthlyPayment> = mutableListOf()

    fun trips(): Set<String> {
        val list = mutableSetOf<String>()
        when(operatorCompany) {
            OperatorCompany.SemParar -> {
                tickets.forEach { ticket ->
                    ticket.metadata.getValue("trip")?.let { list.add(it) }
                }
                credits.forEach { credit ->
                    credit.trip?.let { list.add(it) }
                }
            }
        }
        return list
    }

    @Entity
    @Table(name = "invoice_progress")
    class Progress(
        @OneToOne(cascade = [CascadeType.DETACH])
        @JoinColumn(name = "invoice_id", unique = true, nullable = false)
        val invoice: Invoice
    ) {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long = -1
        var totalOfTickets = 0
        @OneToMany(cascade = [CascadeType.ALL])
        var ticketsDone: MutableList<Item> = mutableListOf()
        var totalOfCredits = 0
        @OneToMany(cascade = [CascadeType.ALL])
        var creditsDone: MutableList<Item> = mutableListOf()

        fun ticketOk() {
            ticketsDone.add(Item(this))
        }

        fun creditOk() {
            creditsDone.add(Item(this))
        }

        fun isZero(): Boolean {
            return ticketsDone.size == 0 && creditsDone.size == 0
        }

        fun isDone(): Boolean {
            if (isZero())
                return false
            return totalOfTickets == ticketsDone.size && totalOfCredits == creditsDone.size
        }

        fun getPercentage(): Int {
            if (isZero())
                return 0
            val total = totalOfTickets +  totalOfCredits
            val done = ticketsDone.size + creditsDone.size
            val workPercentage = (done * 100) / total
            val importPercentage = if (totalOfTickets != 0 || totalOfCredits != 0) 1 else 0
            if (workPercentage == 0)
                return importPercentage
            return importPercentage + (workPercentage - 1)
        }

        @Entity
        @Table(name = "invoice_progress_item")
        class Item(
            @ManyToOne(cascade = [CascadeType.DETACH])
            var progress: Progress
        ) {
            @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
            val id: Long = -1
        }
    }
}

