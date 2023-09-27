package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollPlazaFindResultCache
import br.com.cstag.core.entities.TollPlazaPeriod
import org.springframework.data.repository.CrudRepository
import java.time.LocalDate

interface TollPlazaFindResultCacheRepository : CrudRepository<TollPlazaFindResultCache, String> {
    fun findByStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqualAndCategoryAndHighway(
        startOfPeriod: LocalDate?, endOfPeriod: LocalDate?, category: Int?, highway: String?
    ): TollPlazaFindResultCache?
}