package br.com.cstag.core.dto

data class TollPlazaMessageDto(
    val bucketName: String,
    val objectName: String,
    val tollPlazaPeriodId: Int,
)