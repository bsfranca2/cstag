package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.Source
import br.com.cstag.core.mappers.MetadataConverter
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "tickets")
class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    var licensePlate: LicensePlate? = null
    var category: Int? = null
    var highway: String? = null
    var fare: BigDecimal? = null
    var paidAt: LocalDateTime? = null
    var trip: String? = null
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id")
    var invoice: Invoice? = null
    @Enumerated(EnumType.STRING)
    var operatorCompany: OperatorCompany? = null
    @Enumerated(EnumType.STRING)
    var source: Source? = null
    @Convert(converter = MetadataConverter::class)
    @Column(columnDefinition = "TEXT")
    var metadata = Metadata()
    @Enumerated(EnumType.STRING)
    var type: Type = Type.Ticket

    @OneToOne(mappedBy = "ticket", cascade = [CascadeType.ALL], orphanRemoval = true)
    var analysis: TicketAnalysis? = null

    enum class Type {
        Ticket, TollValleyTicket
    }

    fun getShippingCompany(): ShippingCompany? {
        return invoice?.shippingCompany
    }
}