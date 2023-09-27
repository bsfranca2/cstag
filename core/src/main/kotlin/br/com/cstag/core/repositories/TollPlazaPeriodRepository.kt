package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollPlazaPeriod
import org.springframework.data.repository.CrudRepository
import java.time.LocalDate

interface TollPlazaPeriodRepository : CrudRepository<TollPlazaPeriod, Int> {
    fun findByStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqual(startOfPeriod: LocalDate, endOfPeriod: LocalDate?): TollPlazaPeriod?
}