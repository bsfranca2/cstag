package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.TollPlazaPeriod
import org.springframework.data.repository.CrudRepository
import java.time.LocalDate

interface TollPlazaRepository : CrudRepository<TollPlaza, Long> {
    fun findByPeriodAndCategory(period: TollPlazaPeriod, category: Int): MutableList<TollPlaza>
}

interface TollPlazaPeriodRepository : CrudRepository<TollPlazaPeriod, Int> {
    fun findByStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqual(startOfPeriod: LocalDate, endOfPeriod: LocalDate?): TollPlazaPeriod?
}