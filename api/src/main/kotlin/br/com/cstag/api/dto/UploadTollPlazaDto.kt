package br.com.cstag.api.dto

import br.com.cstag.core.entities.LocalDateRange
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDate

data class UploadTollPlazaDto(
    val file: MultipartFile,
    val startOfPeriod: String,
    val endOfPeriod: String,
) {
    val period = LocalDateRange(LocalDate.parse(startOfPeriod), LocalDate.parse(endOfPeriod))
}
