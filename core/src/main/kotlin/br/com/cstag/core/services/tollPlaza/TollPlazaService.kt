package br.com.cstag.core.services.tollPlaza

import br.com.cstag.core.entities.LocalDateRange
import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.entities.TollPlazaPeriod
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.TollPlazaPeriodRepository
import br.com.cstag.core.repositories.TollPlazaRepository
import br.com.cstag.core.services.analyze.algorithm.TollPlazaFindAlgorithm
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.*
import javax.transaction.Transactional

@Service
class TollPlazaService(
    private val tollPlazaPeriodRepository: TollPlazaPeriodRepository,
    private val tollPlazaRepository: TollPlazaRepository
) {
    private val tollPlazaFindAlgorithm = TollPlazaFindAlgorithm()

    fun findPeriodById(tollPlazaPeriodId: Int): TollPlazaPeriod {
        return tollPlazaPeriodRepository.findByIdOrNull(tollPlazaPeriodId)
            ?: throw NotFoundException("Periodo de praça $tollPlazaPeriodId não encontrado")
    }

    fun listPeriods(): List<TollPlazaPeriod> {
        return tollPlazaPeriodRepository.findAll().toList().sortedBy { it.startOfPeriod }.sortedBy { it.endOfPeriod }
    }

    @Transactional
    fun save(tollPlazaPeriod: TollPlazaPeriod): TollPlazaPeriod {
        return tollPlazaPeriodRepository.save(tollPlazaPeriod)
    }

    fun changePeriod(tollPlazaPeriodId: Int, newPeriod: LocalDateRange): TollPlazaPeriod {
        val tollPlazaPeriod = findPeriodById(tollPlazaPeriodId)
        tollPlazaPeriod.startOfPeriod = newPeriod.startAt
        tollPlazaPeriod.endOfPeriod = newPeriod.endAt
        return save(tollPlazaPeriod)
    }

    fun findByDateAndCategory(date: LocalDate, category: Int): MutableList<TollPlaza>  {
        val period = tollPlazaPeriodRepository
            .findByStartOfPeriodLessThanEqualAndEndOfPeriodGreaterThanEqual(date, date)
            ?: return mutableListOf()
        return tollPlazaRepository.findByPeriodAndCategory(period, category)
    }

    fun findForTicket(fullRoadName: String, date: LocalDate, category: Int): TollPlazaFindAlgorithm.Result {
        val tollPlazas = findByDateAndCategory(date, category)
        return tollPlazaFindAlgorithm.find(fullRoadName, category, tollPlazas)
    }
}