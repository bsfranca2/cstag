package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TicketAnalysis

interface TollPlazaAlgorithm {
    fun analyze(analysis: TicketAnalysis): TicketAnalysis
}