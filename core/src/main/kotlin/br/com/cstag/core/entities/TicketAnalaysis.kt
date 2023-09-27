package br.com.cstag.core.entities

import java.io.Serializable
import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "ticket_analyzes")
class TicketAnalysis(
    @OneToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "toll_ticket_id")
    val ticket: Ticket,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "vehicle_id")
    var vehicle: Vehicle? = null
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "toll_plaza_id")
    var tollPlaza: TollPlaza? = null
    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "value", column = Column(name = "divergenceValue")),
        AttributeOverride(name = "type", column = Column(name = "divergenceType"))
    )
    var divergence: Divergence? = null

    @Embeddable
    data class Divergence(
        val value: BigDecimal,
        @Enumerated(EnumType.STRING)
        val type: Type
    ) : Serializable {
        enum class Type {
            Negative, Positive, Neutral
        }
    }

    @Entity
    @Table(name = "ticket_analysis_errors")
    data class Error(
        @ManyToOne(cascade = [CascadeType.DETACH])
        @JoinColumn(name = "toll_ticket_id")
        val ticket: Ticket,
        val error: String
    ) {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = -1
    }
}