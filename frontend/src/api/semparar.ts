import request from '@/utils/request'

class SemPararApi {
  private resource = '/semparar'

  tollPlazaDivergences() {
    return request.get(`${this.resource}/divergences/toll-plaza-value`)
  }

  debitAndCreditDivergences() {
    return request.get(`${this.resource}/divergences/credit-debit`)
  }

  uploadInvoice(formData: object) {
    return request.post(`${this.resource}/invoices`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
}

export default new SemPararApi()
