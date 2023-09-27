package br.com.cstag.core.services.vehicle

import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.VehicleRepository
import br.com.cstag.core.services.AccountService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class VehicleService(
    private val vehicleRepository: VehicleRepository,
    private val accountService: AccountService,
) {
    fun findByLicensePlate(licensePlate: LicensePlate): Vehicle {
        return vehicleRepository.findByIdOrNull(licensePlate)
            ?: throw NotFoundException("Veiculo ${licensePlate} não encontrado")
    }

    fun list(account: Account): List<Vehicle> {
        val company = account.company.getShippingCompany()
        return company.vehicles
    }

    @Transactional
    fun save(account: Account, vehicle: Vehicle) {
        val company = account.company.getShippingCompany()
        val vehicleExists = company.vehicles.find { it.licensePlate == vehicle.licensePlate }
        if (vehicleExists != null) {
            company.vehicles.remove(vehicleExists)
        }
        company.addVehicle(vehicle)
        accountService.save(account.copy(company = company))
    }
}