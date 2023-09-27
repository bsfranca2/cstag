package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.TollPlazaFindResultCache
import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.entities.TollTicketAnalysisError
import br.com.cstag.core.repositories.TollPlazaFindResultCacheRepository
import br.com.cstag.core.repositories.TollTicketAnalysisErrorRepository
import br.com.cstag.core.services.analyze.algorithm.TollPlazaFindAlgorithmSemParar
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class TollPlazaCacheService(
    private val tollPlazaService: TollPlazaService,
    private val tollPlazaFindResultCacheRepository: TollPlazaFindResultCacheRepository,
    private val tollTicketAnalysisErrorRepository: TollTicketAnalysisErrorRepository
) {
    companion object {
        private val tollPlazaFindAlgorithm = TollPlazaFindAlgorithmSemParar()
        private val logger = LoggerFactory.getLogger(this::class.java)
    }

    fun findOrCreate(tollTicket: TollTicket): TollPlazaFindResultCache {
        return tollPlazaFindResultCacheRepository
            .findByHighwayAndCategoryAndStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqual(
                tollTicket.highway, tollTicket.category, tollTicket.paidAt.toLocalDate(), tollTicket.paidAt.toLocalDate()
            )
            ?: create(tollTicket)
    }

    fun create(tollTicket: TollTicket): TollPlazaFindResultCache {
        try {
            val tollPlazas = tollPlazaService.findByDateAndCategory(tollTicket.paidAt.toLocalDate(), tollTicket.category)
            val tollPlazaFindResult = tollPlazaFindAlgorithm.find(tollTicket, tollPlazas)
            val tollPlazaFindResultCache = TollPlazaFindResultCache(
                highway = tollTicket.highway,
                category = tollTicket.category,
                startOfPeriod = tollPlazaFindResult.tollPlaza.period.startOfPeriod,
                endOfPeriod = tollPlazaFindResult.tollPlaza.period.endOfPeriod,
                tollPlaza = tollPlazaFindResult.tollPlaza,
                isVerified = false,
                hasLowProbabilityRate = tollPlazaFindResult.hasLowProbabilityRate
            )
            return tollPlazaFindResultCacheRepository.save(tollPlazaFindResultCache)
        } catch (e: Exception) {
            logger.error("Fazer verificação manual do item abaixo:")
            logger.error("ID:${tollTicket.id}|HIGHWAY:${tollTicket.highway}")
            val error = TollTicketAnalysisError(
                tollTicket = tollTicket,
                error = e.message ?: e.localizedMessage
            )
            tollTicketAnalysisErrorRepository.save(error)
            throw e
        }
    }
}