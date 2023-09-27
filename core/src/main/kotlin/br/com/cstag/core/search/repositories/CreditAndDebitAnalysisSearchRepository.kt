package br.com.cstag.core.search.repositories

import br.com.cstag.core.search.entities.CreditAndDebitAnalysisSearch
import br.com.cstag.core.search.entities.TicketAnalysisSearch
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import java.util.*

interface CreditAndDebitAnalysisSearchRepository : ElasticsearchRepository<CreditAndDebitAnalysisSearch, Long>