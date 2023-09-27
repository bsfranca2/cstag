package br.com.cstag.api.controllers

import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.api.utils.FileUtil
import br.com.cstag.core.services.semparar.sheet.InvoiceSemPararService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/semparar")
class SemPararController {
    @Autowired
    lateinit var invoiceSemPararService: InvoiceSemPararService
    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @PostMapping("/invoices", consumes = ["multipart/form-data"])
    fun uploadInvoice(@RequestPart("file") multipartFile: MultipartFile) {
        val accountCNPJ = getAccountLoggedContextService.getAccountCNPJ()
        val file = FileUtil.convertMultiPartFileToFile(multipartFile)
        invoiceSemPararService.createInvoiceAndUpload(CNPJ(accountCNPJ), file)
    }
}