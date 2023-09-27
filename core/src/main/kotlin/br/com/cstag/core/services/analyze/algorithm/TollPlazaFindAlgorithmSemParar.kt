package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.BaseTicket
import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.services.analyze.utils.*
import java.math.BigDecimal

/**
 * 1 - Filtrar por número da avenida (estadual, federal[BR])
 * 2 - Filtrar o km
 * 3 - Nome da cidade
 */
class TollPlazaFindAlgorithmSemParar : TollPlazaFindAlgorithm {
    companion object {
        private val DIFFERENCE_WITH_LOW_PROBABILITY_RATE = BigDecimal("2.0")
    }

    override fun find(tollTicket: BaseTicket, tollPlazaList: List<TollPlaza>): TollPlazaFindResult {
        val tollPlazaListFiltered = tollPlazaList
            .filter { it.category == tollTicket.category }
            .sortedByDescending { it.value }
            .distinctBy { it.description }

        return try {
            val roadCodeTarget = RoadCodeRetriever.retrieve(tollTicket.highway)
            val tollPlazaListFilteredByRoadCode = tollPlazaListFiltered.filter {
                try {
                    RoadCodeRetriever.retrieve(it.roadCode).isSame(roadCodeTarget)
                } catch (e: Exception) {
                    false
                }
            }
            findByClosestKm(tollTicket, tollPlazaListFilteredByRoadCode)
        } catch (e: Exception) {
            findByClosestKm(tollTicket, tollPlazaListFiltered)
        }
    }

    private fun findByClosestKm(tollTicket: BaseTicket, tollPlazaListFiltered: List<TollPlaza>): TollPlazaFindResult {
        val km = KmNumberRetriever.retrieve(tollTicket.highway)
        val tollPlazaItemIndex = FindClosestKm.findIndex(km, tollPlazaListFiltered.map { it.km })
        val tollPlazaItem = tollPlazaListFiltered.getOrNull(tollPlazaItemIndex)
            ?: throw RuntimeException("Toll plazza not found")

        var hasLowProbabilityRate = false
        val differenceBetweenKmTargetAndKmResult =
            SplitKm.valueOf(km).toBigDecimal() - SplitKm.valueOf(tollPlazaItem.km).toBigDecimal()
        if (differenceBetweenKmTargetAndKmResult >= DIFFERENCE_WITH_LOW_PROBABILITY_RATE) {
            hasLowProbabilityRate = true
        }

        return TollPlazaFindResult(tollPlazaItem, hasLowProbabilityRate)
    }
}