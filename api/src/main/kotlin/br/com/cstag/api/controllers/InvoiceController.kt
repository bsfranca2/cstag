package br.com.cstag.api.controllers

import br.com.cstag.api.dto.InvoiceDto
import br.com.cstag.api.dto.toInvoiceDto
import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.core.services.InvoiceService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/invoices")
class InvoiceController {
    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @Autowired
    lateinit var invoiceService: InvoiceService

    @GetMapping
    fun list(): List<InvoiceDto> {
        val accountCNPJ = CNPJ(getAccountLoggedContextService.getAccountCNPJ())
        return invoiceService.findByShippingCompanyCNPJ(accountCNPJ).map { it.toInvoiceDto() }
    }

    @DeleteMapping("/{invoiceId}")
    fun delete(@PathVariable invoiceId: Long) {
        /// TODO Deletar analysis error
        val accountCNPJ = CNPJ(getAccountLoggedContextService.getAccountCNPJ())
        invoiceService.deleteWithConfirmation(accountCNPJ, invoiceId)
    }
}