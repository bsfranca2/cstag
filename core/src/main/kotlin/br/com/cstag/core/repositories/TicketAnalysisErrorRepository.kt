package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TicketAnalysis
import org.springframework.data.repository.CrudRepository

interface TicketAnalysisErrorRepository : CrudRepository<TicketAnalysis.Error, Long>