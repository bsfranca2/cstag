package br.com.cstag.core.search.repositories

import br.com.cstag.core.search.entities.TicketAnalysisSearch
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import java.util.*

interface TicketAnalysisSearchRepository : ElasticsearchRepository<TicketAnalysisSearch, Long>