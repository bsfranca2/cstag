package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollTicketAnalysisError
import org.springframework.data.repository.CrudRepository

interface TollTicketAnalysisErrorRepository : CrudRepository<TollTicketAnalysisError, Long>