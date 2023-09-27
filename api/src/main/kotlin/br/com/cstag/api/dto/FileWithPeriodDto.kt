package br.com.cstag.api.dto

import br.com.cstag.core.entities.LocalDateTimeRange
import org.springframework.web.multipart.MultipartFile
import java.time.Instant

data class FileWithPeriodDto(
    val file: MultipartFile,
    val startOfPeriod: Instant,
    val endOfPeriod: Instant?,
) {
    val period = LocalDateTimeRange(startOfPeriod, endOfPeriod)
}