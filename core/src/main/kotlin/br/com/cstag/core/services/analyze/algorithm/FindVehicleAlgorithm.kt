package br.com.cstag.core.services.analyze.algorithm

import br.com.cstag.core.entities.LicensePlate
import br.com.cstag.core.entities.Vehicle

interface FindVehicleAlgorithm {
    fun find(licensePlate: LicensePlate): Vehicle
}