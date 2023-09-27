package br.com.cstag.adapters.searchengine.meili

import br.com.cstag.core.dto.CreditAndDebitAnalysisSearchDto
import br.com.cstag.core.dto.TollTicketAnalysisSearchDto

open class SearchResponseDto <T>(
    var hits: Array<T>,
    var offset: Int,
    var limit: Int,
    var nbHits: Int
)

class TollTicketAnalysisSearchResponseDto(
    hits: Array<TollTicketAnalysisSearchDto>,
    offset: Int,
    limit: Int,
    nbHits: Int
) : SearchResponseDto<TollTicketAnalysisSearchDto>(hits, offset, limit, nbHits)

class CreditAndDebitAnalysisSearchResponseDto(
    hits: Array<CreditAndDebitAnalysisSearchDto>,
    offset: Int,
    limit: Int,
    nbHits: Int
) : SearchResponseDto<CreditAndDebitAnalysisSearchDto>(hits, offset, limit, nbHits)