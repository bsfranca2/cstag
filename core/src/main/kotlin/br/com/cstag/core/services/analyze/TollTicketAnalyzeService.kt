package br.com.cstag.core.services.analyze

import br.com.cstag.core.entities.TollTicket
import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.services.analyze.algorithm.*
import br.com.cstag.core.services.tollPlaza.TollPlazaCacheService
import br.com.cstag.core.services.VehicleService
import org.springframework.stereotype.Service

@Service
class TollTicketAnalyzeService(
    private val vehicleService: VehicleService,
    private val tollPlazaCacheService: TollPlazaCacheService
) {
    fun analyzeAxles(tollTicket: TollTicket): TollTicket {
        val analysis = tollTicket.analysis ?: TollTicketAnalysis(tollTicket)
        val algorithm: VehicleAxlesAlgorithm = when(tollTicket.operatorCompany) {
            OperatorCompany.SemParar -> VehicleAxlesAlgorithmSemParar(vehicleService)
            else -> VehicleAxlesAlgorithmSemParar(vehicleService)
        }
        tollTicket.analysis = AlgorithmPipeline(analysis)
            .and { algorithm.analyze(it) }
            .item
        return tollTicket
    }

    fun analyzeTollPlaza(tollTicket: TollTicket): TollTicket {
        val analysis = tollTicket.analysis ?: TollTicketAnalysis(tollTicket)
        val algorithm: TollPlazaAlgorithm = when(tollTicket.operatorCompany) {
            OperatorCompany.SemParar -> TollPlazaAlgorithmSemParar(tollPlazaCacheService)
            else -> TollPlazaAlgorithmSemParar(tollPlazaCacheService)
        }
        tollTicket.analysis = AlgorithmPipeline(analysis)
            .and { algorithm.analyze(it) }
            .item
        return tollTicket
    }

    fun analyzeDuplicity() {}
}