package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
import br.com.cstag.api.utils.FileUtil
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
        val file = FileUtil.convertMultiPartFileToFile(dto.file)
        tollPlazaSheetService.uploadSheet(file, dto.period)
    }

    @GetMapping("/periods")
    fun listPeriods(): List<TollPlazaPeriodDto> {
        return tollPlazaService.listPeriods().map { it.toTollPlazaPeriodDto() }
    }

    @PutMapping("/periods/{id}")
    fun changePeriod(@PathVariable id: Int, @RequestBody dto: LocalDateRangeDto): TollPlazaPeriodDto {
        return tollPlazaService.changePeriod(id, dto.toLocalDateRange()).toTollPlazaPeriodDto()
    }
}