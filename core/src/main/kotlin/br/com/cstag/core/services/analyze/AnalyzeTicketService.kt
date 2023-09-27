package br.com.cstag.core.services.analyze

import br.com.cstag.core.entities.Ticket
import br.com.cstag.core.entities.TicketAnalysis
import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.repositories.VehicleRepository
import br.com.cstag.core.services.analyze.algorithm.FindVehicleAlgorithmImp
import br.com.cstag.core.services.analyze.algorithm.TollPlazaAlgorithm
import br.com.cstag.core.services.analyze.algorithm.TollPlazaAlgorithmSemParar
import org.springframework.stereotype.Service

@Service
class AnalyzeTicketService(
    private val tollPlazaAlgorithmSemParar: TollPlazaAlgorithmSemParar,
    private val vehicleRepository: VehicleRepository
) {
    fun analyze(ticket: Ticket): Ticket {
        if (ticket.operatorCompany == null)
            throw RuntimeException("Passagem sem operadora definida ${ticket.id}")
        val analysis = ticket.analysis ?: TicketAnalysis(ticket)
        ticket.analysis = analysis
            .run { analyzeAxles(this) }
            .run { analyzeTollPlaza(this) }
        return ticket
    }
    
    fun analyzeAxles(analysis: TicketAnalysis): TicketAnalysis {
        kotlin.runCatching {
            val findVehicleAlgorithmImp = FindVehicleAlgorithmImp(vehicleRepository)
            analysis.ticket.licensePlate?.let {
                analysis.vehicle = findVehicleAlgorithmImp.find(it)
            }
        }
        return analysis
    }

    fun analyzeTollPlaza(analysis: TicketAnalysis): TicketAnalysis {
        val algorithm: TollPlazaAlgorithm = when(analysis.ticket.operatorCompany!!) {
            OperatorCompany.SemParar -> tollPlazaAlgorithmSemParar
        }
        return algorithm.analyze(analysis)
    }
}