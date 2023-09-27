package br.com.cstag.api.controllers

import br.com.cstag.api.dto.VehicleDto
import br.com.cstag.api.dto.toVehicle
import br.com.cstag.api.dto.toVehicleDto
import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.core.services.VehicleService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/vehicles")
class VehicleController {
    @Autowired
    lateinit var vehicleService: VehicleService
    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @GetMapping
    fun getAll(): List<VehicleDto> {
        val accountCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        return vehicleService.list(CNPJ(accountCNPJ)).map { it.toVehicleDto() }
    }

    @PostMapping
    fun save(@RequestBody dto: VehicleDto) {
        val accountCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        vehicleService.save(CNPJ(accountCNPJ), dto.toVehicle())
    }

    @GetMapping("/license-plate")
    fun listLicensePlateEntries(): List<String> {
        val accountCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        return vehicleService.list(CNPJ(accountCNPJ)).map { it.licensePlate.value }
    }
}