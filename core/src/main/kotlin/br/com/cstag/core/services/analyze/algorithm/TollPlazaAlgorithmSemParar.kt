package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.entities.TollTicketAnalysisDivergence
import br.com.cstag.core.enums.DivergenceStatus
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.services.tollPlaza.TollPlazaCacheService
import org.slf4j.LoggerFactory

class TollPlazaAlgorithmSemParar(
    private val tollPlazaCacheService: TollPlazaCacheService,
) : TollPlazaAlgorithm {
    private val logger = LoggerFactory.getLogger(this::class.java)

    override fun analyze(analysis: TollTicketAnalysis): TollTicketAnalysis {
        val tollTicket = analysis.tollTicket
        kotlin.runCatching {
            val cache = tollPlazaCacheService.findOrCreate(tollTicket)
            analysis.tollPlaza = cache.tollPlaza
            if (cache.tollPlaza.value == tollTicket.fare) {
                tollTicket.status = TollRegistryStatus.Ok
                analysis.divergence = null
            } else {
                tollTicket.status = TollRegistryStatus.Pending
                analysis.divergence = TollTicketAnalysisDivergence(
                    type = getTollBoothDivergenceType(tollTicket, cache.tollPlaza),
                    status = DivergenceStatus.Pending,
                )
            }
        }.onFailure {
            val message = it.message ?: it.localizedMessage
            logger.error("Erro no ticket ${tollTicket.id} - $message")
        }
        return analysis
    }

    private fun getTollBoothDivergenceType(
        tollTicket: TollTicket,
        tollPlaza: TollPlaza
    ): TollTicketAnalysisDivergence.Type {
        if (tollPlaza.value > tollTicket.fare)
            return TollTicketAnalysisDivergence.Type.Positive
        return TollTicketAnalysisDivergence.Type.Negative
    }
}