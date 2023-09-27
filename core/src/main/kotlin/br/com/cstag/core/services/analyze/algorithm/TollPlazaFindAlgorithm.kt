package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.BaseTicket
import br.com.cstag.core.entities.TollPlaza

interface TollPlazaFindAlgorithm {
    fun find(tollTicket: BaseTicket, tollPlazaList: List<TollPlaza>): TollPlazaFindResult
}

data class TollPlazaFindResult(
    val tollPlaza: TollPlaza,
    val hasLowProbabilityRate: Boolean
)