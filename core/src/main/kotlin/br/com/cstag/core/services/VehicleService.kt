package br.com.cstag.core.services

import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.VehicleRepository
import br.com.cstag.core.valueobjects.CNPJ
import br.com.cstag.core.valueobjects.LicensePlate
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

    fun list(accountCNPJ: CNPJ): List<Vehicle> {
        val account = accountService.findAccountByCNPJ(accountCNPJ)
        val company = account.company.getShippingCompany()
        return company.vehicles
    }

    @Transactional
    fun save(accountCNPJ: CNPJ, vehicle: Vehicle) {
        val account = accountService.findAccountByCNPJ(accountCNPJ)
        val company = account.company.getShippingCompany()
        val vehicleExists = company.vehicles.find { it.licensePlate == vehicle.licensePlate }
        if (vehicleExists != null) {
            company.vehicles.remove(vehicleExists)
        }
        company.addVehicle(vehicle)
        accountService.save(account.copy(company = company))
    }
}