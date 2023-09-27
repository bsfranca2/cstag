package br.com.cstag.core.repositories

import br.com.cstag.core.entities.TollTicketAnalysis
import org.springframework.data.repository.CrudRepository

interface TollTicketAnalysisRepository : CrudRepository<TollTicketAnalysis, Long>