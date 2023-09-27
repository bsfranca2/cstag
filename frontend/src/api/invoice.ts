import request from '@/utils/request'

class InvoiceApi {
  private resource = '/invoices'

  list() {
    return request.get<InvoiceDto[]>(`${this.resource}`)
  }

  delete(id: number) {
    return request.delete(`${this.resource}/${id}`)
  }
}

export default new InvoiceApi()
