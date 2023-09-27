package br.com.cstag.core.services

import br.com.cstag.core.entities.TollTicketAnalysis
import br.com.cstag.core.repositories.TollTicketAnalysisErrorRepository
import br.com.cstag.core.repositories.TollTicketAnalysisRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TollTicketAnalysisService(
    private val tollTicketAnalysisRepository: TollTicketAnalysisRepository
) {
    fun findById(id: Long): TollTicketAnalysis? {
        return tollTicketAnalysisRepository.findByIdOrNull(id)
    }
}