package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.entities.TollTicketAnalysisDivergence
import br.com.cstag.core.enums.DivergenceStatus
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.services.VehicleService
import org.slf4j.LoggerFactory

class VehicleAxlesAlgorithmSemParar(
    private val vehicleService: VehicleService
) : VehicleAxlesAlgorithm {
    private val logger = LoggerFactory.getLogger(this::class.java)

    override fun analyze(analysis: TollTicketAnalysis): TollTicketAnalysis {
        try {
            val tollTicket = analysis.tollTicket
            val vehicle = vehicleService.findByLicensePlate(tollTicket.licensePlate)
            val axlesRegistry = vehicle.getAxlesRegistry(tollTicket.paidAt)
                ?: throw NotFoundException("Registro de eixo não encontrado neste periodo")
            if (axlesRegistry.suspended != tollTicket.category && analysis.divergence == null) {
                analysis.divergence = TollTicketAnalysisDivergence(
                    type = TollTicketAnalysisDivergence.Type.Negative,
                    status = DivergenceStatus.Pending
                )
            }
        } catch (e: Exception) {
            logger.error(e.message ?: e.localizedMessage)
        }
        return analysis
    }
}