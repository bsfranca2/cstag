package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table(name = "toll_ticket_analysis_errors")
data class TollTicketAnalysisError(
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "toll_ticket_id")
    val tollTicket: TollTicket,
    val error: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = -1
}