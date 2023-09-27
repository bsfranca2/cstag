package br.com.cstag.api.dto

import br.com.cstag.core.enums.OperatorCompany
import org.springframework.web.multipart.MultipartFile

data class UploadInvoiceDto(
    val file: MultipartFile,
    val operatorCompany: OperatorCompany,
)
