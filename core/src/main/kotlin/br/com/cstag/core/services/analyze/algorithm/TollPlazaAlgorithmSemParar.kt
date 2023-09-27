package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.*
import br.com.cstag.core.repositories.TicketAnalysisErrorRepository
import br.com.cstag.core.services.tollPlaza.TollPlazaCacheService
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class TollPlazaAlgorithmSemParar(
    private val tollPlazaCacheService: TollPlazaCacheService,
    private val ticketAnalysisErrorRepository: TicketAnalysisErrorRepository,
) : TollPlazaAlgorithm {
    /// TODO Buscar no banco se a avenida da passagem deve ser buscada de outra forma
    override fun analyze(analysis: TicketAnalysis): TicketAnalysis {
        kotlin.runCatching {
            val cacheTollPlaza = getCache(analysis).tollPlaza
            analysis.tollPlaza = cacheTollPlaza
            analysis.divergence = if (cacheTollPlaza.value == analysis.ticket.fare) {
                null
            } else {
                getDivergenceType(analysis.ticket, cacheTollPlaza)
            }

            if (analysis.divergence == null) {
                val vehicle = analysis.vehicle
                val date = analysis.ticket.paidAt
                if (vehicle != null && date != null) {
                    vehicle.getAxlesRegistry(date)?.let { axlesRegistry ->
                        if (analysis.ticket.category != axlesRegistry.total
                            && analysis.ticket.category != axlesRegistry.suspended) {
                            analysis.divergence = TicketAnalysis.Divergence(
                                value = BigDecimal.ZERO,
                                type = TicketAnalysis.Divergence.Type.Neutral
                            )
                        }
                    }
                }
            }
        }.onFailure {
            val error = TicketAnalysis.Error(
                ticket = analysis.ticket,
                error = it.message ?: it.localizedMessage
            )
            ticketAnalysisErrorRepository.save(error)
        }
        return analysis
    }

    private fun getCache(analysis: TicketAnalysis): TollPlazaFindResultCache {
        val ticket = analysis.ticket
        val fullRoadName = ticket.highway
        val date = ticket.paidAt
        val operatorCompany = ticket.operatorCompany
        val category = ticket.category
        if (fullRoadName == null || category == null || date == null || operatorCompany == null)
            throw RuntimeException("Informações insuficientes para pesquisa de praça da passagem ${ticket.id}")

        return tollPlazaCacheService.findOrCreate(fullRoadName, category, date.toLocalDate(), operatorCompany)
    }

    private fun getDivergenceType(
        ticket: Ticket,
        tollPlaza: TollPlaza
    ): TicketAnalysis.Divergence {
        if (tollPlaza.value > ticket.fare)
            return TicketAnalysis.Divergence(
                value = tollPlaza.value - (ticket.fare ?: BigDecimal.ZERO),
                type = TicketAnalysis.Divergence.Type.Positive
            )
        return TicketAnalysis.Divergence(
            value = (ticket.fare ?: BigDecimal.ZERO) - tollPlaza.value,
            type = TicketAnalysis.Divergence.Type.Negative
        )
    }
}