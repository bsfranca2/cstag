package br.com.cstag.core.repositories

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Vehicle
import org.springframework.data.repository.CrudRepository

interface VehicleRepository : CrudRepository<Vehicle, LicensePlate>