package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table
class TicketProgress(
    @OneToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id", unique = true, nullable = false)
    val invoice: Invoice,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    var ticketTotal = 0
    var ticketDone = 0
    var creditTotal = 0
    @OneToMany(mappedBy = "ticketProgress", cascade = [CascadeType.ALL])
    var creditDone = mutableListOf<TicketProgressItem>()

    fun ticketOk() {
        ticketDone += 1
    }

    fun creditOk() {
        creditDone.add(TicketProgressItem(this))
    }

    fun isZero(): Boolean {
        return ticketTotal == 0 && creditDone.size == 0
    }

    fun isDone(): Boolean {
        if (isZero())
            return false
        return ticketTotal == ticketDone && creditTotal == creditDone.size
    }

    fun getPercentage(): Int {
        if (isZero())
            return 0
        val total = ticketTotal + creditTotal
        val done = ticketDone + creditDone.size
        return (done * 100) / total
    }
}

@Entity
@Table
data class TicketProgressItem(
    @ManyToOne
    val ticketProgress: TicketProgress
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = -1
}