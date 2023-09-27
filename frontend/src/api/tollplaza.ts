import request from '@/utils/request'

class TollPlazaApi {
  private resource = '/toll-plazas'

  upload(formData: FormData) {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return request.post(`${this.resource}/upload`, formData, config)
  }

  listAllPeriod() {
    return request.get<TollPlazaPeriodDto[]>(`${this.resource}/periods`)
  }

  changePeriod(id: number, data: PeriodDto) {
    return request.put<TollPlazaPeriodDto>(`${this.resource}/periods/${id}`, data)
  }
}

export default new TollPlazaApi()
