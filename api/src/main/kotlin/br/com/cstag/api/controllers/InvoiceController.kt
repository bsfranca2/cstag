package br.com.cstag.api.controllers

import br.com.cstag.api.dto.InvoiceDto
import br.com.cstag.api.dto.UploadInvoiceDto
import br.com.cstag.api.dto.toInvoiceDto
import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.api.utils.FileUtil.toFile
import br.com.cstag.core.services.invoice.ImportInvoiceService
import br.com.cstag.core.services.invoice.InvoiceService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/invoices")
class InvoiceController {
    @Autowired
    lateinit var accountLoggedContextService: AccountLoggedContextService
    @Autowired
    lateinit var invoiceService: InvoiceService
    @Autowired
    lateinit var importInvoiceService: ImportInvoiceService

    @PostMapping("/upload", consumes = ["multipart/form-data"])
    @ResponseStatus(HttpStatus.CREATED)
    fun upload(@ModelAttribute dto: UploadInvoiceDto) {
        val account = accountLoggedContextService.getAccount()
        importInvoiceService.createInvoiceAndUpload(account, dto.operatorCompany, dto.file.toFile())
    }

    @GetMapping
    fun list(): List<InvoiceDto> {
        return invoiceService
            .findByShippingCompanyCNPJ(accountLoggedContextService.getAccountCNPJ())
            .map { it.toInvoiceDto() }
    }


    @DeleteMapping("/{invoiceId}")
    fun delete(@PathVariable invoiceId: Long) {
        /// TODO Deletar analysis error
        // val accountCNPJ = CNPJ(getAccountLoggedContextService.getAccountCNPJ())
        // invoiceService.deleteWithConfirmation(accountCNPJ, invoiceId)
        invoiceService.delete(invoiceId)
    }
}