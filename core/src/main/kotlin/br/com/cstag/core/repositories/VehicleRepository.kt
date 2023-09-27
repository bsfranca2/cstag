package br.com.cstag.core.repositories

import br.com.cstag.core.entities.Vehicle
import br.com.cstag.core.valueobjects.LicensePlate
import org.springframework.data.repository.CrudRepository

interface VehicleRepository : CrudRepository<Vehicle, LicensePlate>