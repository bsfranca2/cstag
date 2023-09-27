package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.exceptions.NotFoundException
import br.com.cstag.core.repositories.VehicleRepository
import org.springframework.data.repository.findByIdOrNull
import java.time.LocalDateTime

class FindVehicleAlgorithmImp(
    private val vehicleRepository: VehicleRepository
) : FindVehicleAlgorithm {
    override fun find(licensePlate: LicensePlate): Vehicle {
        return vehicleRepository.findByIdOrNull(licensePlate)
            ?: throw NotFoundException("Vehicle ${licensePlate.value} not found")
    }
}