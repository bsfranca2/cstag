package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.entities.TollTicketAnalysis

interface TollPlazaAlgorithm {
    fun analyze(analysis: TollTicketAnalysis): TollTicketAnalysis
}