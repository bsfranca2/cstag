package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TollPlaza
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.services.analyze.utils.*
import java.math.BigDecimal

class TollPlazaFindAlgorithm {
    companion object {
        val DIFFERENCE_WITH_LOW_PROBABILITY_RATE = BigDecimal("2")
    }

    fun find(fullRoadName: String, category: Int, tollPlazaList: List<TollPlaza>): Result {
        val tollPlazaListFiltered = tollPlazaList
            .filter { it.category == category }
            .sortedByDescending { it.value }
            .distinctBy { it.fullRoadName }

        return try {
            val roadCodeTarget = RoadCodeRetriever.retrieve(fullRoadName)
            val tollPlazaListFilteredByHighway = tollPlazaListFiltered.filter {
                try {
                    RoadCodeRetriever.retrieve(it.highway).isSame(roadCodeTarget)
                } catch (e: Exception) {
                    false
                }
            }
            findByClosestKm(fullRoadName, tollPlazaListFilteredByHighway)
        } catch (e: Exception) {
            findByClosestKm(fullRoadName, tollPlazaListFiltered)
        }
    }

    private fun findByClosestKm(ticketHighway: String, tollPlazaListFiltered: List<TollPlaza>): Result {
        val km = KmNumberRetriever.retrieve(ticketHighway)
        val tollPlazaItemIndex = FindClosestKm.findIndex(km, tollPlazaListFiltered.map { it.km })
        val tollPlazaItem = tollPlazaListFiltered.getOrNull(tollPlazaItemIndex)
            ?: throw NotFoundException("Praça não encontrada para o indice $tollPlazaItemIndex [$ticketHighway]")

        var hasLowProbabilityRate = false
        val differenceBetweenKmTargetAndKmResult =
            SplitKm.valueOf(km).toBigDecimal() - SplitKm.valueOf(tollPlazaItem.km).toBigDecimal()
        if (differenceBetweenKmTargetAndKmResult >= DIFFERENCE_WITH_LOW_PROBABILITY_RATE) {
            hasLowProbabilityRate = true
        }

        return Result(tollPlazaItem, hasLowProbabilityRate)
    }

    data class Result(
        val tollPlaza: TollPlaza,
        val hasLowProbabilityRate: Boolean
    )
}