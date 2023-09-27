import request from '@/utils/request'

class VehicleApi {
  private resource = '/vehicles'

  getAll() {
    return request.get<VehicleDto[]>(`${this.resource}`)
  }

  save(data: VehicleDto) {
    return request.post(`${this.resource}`, data)
  }

  licensePlateEntries() {
    return request.get<string[]>(`${this.resource}/license-plate`)
  }
}

export default new VehicleApi()
