import request from '@/utils/request'

class AnalyzeApi {
  private resource = '/analyzes'

  searchTollTicket(data: TollTicketAnalysisFilterDto, paginate: PaginateDto) {
    return request.post<SearchResultDto<TollTicketAnalysisSearchDto>>(`${this.resource}/toll-ticket/search`, data, { params: paginate })
  }

  getTollTicketById(id: number) {
    return request.get<TollTicketAnalysisDto>(`${this.resource}/toll-ticket/${id}`)
  }

  searchCreditAndDebit(data: CreditAndDebitAnalysisFilterDto, paginate: PaginateDto) {
    return request.post<SearchResultDto<CreditAndDebitAnalysisDto>>(`${this.resource}/credit-debit/search`, data, { params: paginate })
  }
}

export default new AnalyzeApi()
