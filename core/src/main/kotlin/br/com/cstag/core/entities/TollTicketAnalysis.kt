package br.com.cstag.core.entities

import br.com.cstag.core.enums.DivergenceStatus
import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name = "toll_ticket_analysis")
class TollTicketAnalysis(
    @OneToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "toll_ticket_id")
    val tollTicket: TollTicket
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
    var divergence: TollTicketAnalysisDivergence? = null
}

@Embeddable
data class TollTicketAnalysisDivergence(
    @Enumerated(EnumType.STRING)
    var type: Type,
    @Enumerated(EnumType.STRING)
    var status: DivergenceStatus,
) : Serializable {
    enum class Type {
        Negative, Positive
    }
}
