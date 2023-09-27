package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.TollPlazaPeriod
import org.springframework.data.repository.CrudRepository

interface TollPlazaRepository : CrudRepository<TollPlaza, Long> {
    fun findByPeriodAndCategory(period: TollPlazaPeriod, category: Int): MutableList<TollPlaza>
}