package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.LocalDateRange
import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.entities.TicketAnalysis
import br.com.cstag.core.entities.TollPlazaFindResultCache
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.repositories.TollPlazaFindResultCacheRepository
import br.com.cstag.core.repositories.TicketAnalysisErrorRepository
import br.com.cstag.core.services.analyze.algorithm.TollPlazaFindAlgorithm
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class TollPlazaCacheService(
    private val tollPlazaService: TollPlazaService,
    private val tollPlazaFindResultCacheRepository: TollPlazaFindResultCacheRepository
) {
    fun findOrCreate(
        fullRoadName: String,
        category: Int,
        date: LocalDate,
        operatorCompany: OperatorCompany
    ): TollPlazaFindResultCache {
        return tollPlazaFindResultCacheRepository
            .findByStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqualAndCategoryAndHighway(
                date, date, category, fullRoadName
            )
            ?: create(fullRoadName, category, date, operatorCompany)
    }

    fun create(
        fullRoadName: String,
        category: Int,
        date: LocalDate,
        operatorCompany: OperatorCompany
    ): TollPlazaFindResultCache {
        val tollPlazaFindResult = tollPlazaService.findForTicket(fullRoadName, date, category)
        val tollPlazaFindResultCache = TollPlazaFindResultCache(
            highway = fullRoadName,
            category = category,
            startOfPeriod = tollPlazaFindResult.tollPlaza.period.startOfPeriod,
            endOfPeriod = tollPlazaFindResult.tollPlaza.period.endOfPeriod,
            tollPlaza = tollPlazaFindResult.tollPlaza,
            isVerified = false,
            hasLowProbabilityRate = tollPlazaFindResult.hasLowProbabilityRate
        )
        return tollPlazaFindResultCacheRepository.save(tollPlazaFindResultCache)
    }
}