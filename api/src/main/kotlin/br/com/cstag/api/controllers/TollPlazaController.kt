package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
import br.com.cstag.api.utils.FileUtil.toFile
import br.com.cstag.core.services.tollPlaza.TollPlazaService
import br.com.cstag.core.services.tollPlaza.TollPlazaSheetService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/toll-plazas")
class TollPlazaController {
    @Autowired
    lateinit var tollPlazaService: TollPlazaService
    @Autowired
    lateinit var tollPlazaSheetService: TollPlazaSheetService

    @PostMapping("/upload", consumes = ["multipart/form-data"])
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@ModelAttribute dto: UploadTollPlazaDto) {
        tollPlazaSheetService.uploadSheet(dto.file.toFile(), dto.period)
    }

    @GetMapping("/periods")
    fun listPeriods(): List<TollPlazaPeriodDto> {
        return tollPlazaService.listPeriods().map { it.toTollPlazaPeriodDto() }
    }

    @GetMapping("/periods/{id}")
    fun period(@PathVariable id: Int): TollPlazaDto {
        return tollPlazaService.findPeriodById(id).toTollPlazaDto()
    }

    @PutMapping("/periods/{id}")
    fun changePeriod(@PathVariable id: Int, @RequestBody dto: LocalDateRangeDto): TollPlazaPeriodDto {
        return tollPlazaService.changePeriod(id, dto.toLocalDateRange()).toTollPlazaPeriodDto()
    }
}