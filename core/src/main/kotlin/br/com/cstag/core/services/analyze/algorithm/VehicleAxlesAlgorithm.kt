package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TollTicketAnalysis

interface VehicleAxlesAlgorithm {
    fun analyze(analysis: TollTicketAnalysis): TollTicketAnalysis
}