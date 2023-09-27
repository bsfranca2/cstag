package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.api.utils.FileUtil.toFile
import br.com.cstag.core.services.vehicle.ImportVehicleService
import br.com.cstag.core.services.vehicle.VehicleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/vehicles")
class VehicleController {
    @Autowired
    lateinit var vehicleService: VehicleService
    @Autowired
    lateinit var importVehicleService: ImportVehicleService
    @Autowired
    lateinit var accountLoggedContextService: AccountLoggedContextService

    fun getAccount() =
        accountLoggedContextService.getAccount()

    @GetMapping
    fun getAll(): List<VehicleDto> {
        return vehicleService.list(getAccount()).map { it.toVehicleDto() }
    }

    @PostMapping("/upload", consumes = ["multipart/form-data"])
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@ModelAttribute dto: FileWithPeriodDto) {
        importVehicleService.importSheet(getAccount(), dto.period, dto.file.toFile())
    }

    @PostMapping
    fun save(@RequestBody dto: VehicleDto) {
        vehicleService.save(getAccount(), dto.toVehicle())
    }

    @GetMapping("/license-plate")
    fun listLicensePlateEntries(): List<String> {
        return vehicleService.list(getAccount()).map { it.licensePlate.value }
    }
}