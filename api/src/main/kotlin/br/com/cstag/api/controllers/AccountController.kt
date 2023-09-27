package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
import br.com.cstag.core.services.AbstractCompanyService
import br.com.cstag.core.services.AccountService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/accounts")
class AccountController {
    @Autowired
    lateinit var accountService: AccountService
    @Autowired
    lateinit var abstractCompanyService: AbstractCompanyService

    @GetMapping
    fun getAll(): List<AccountDto> {
       return accountService.findAll().sortedBy { it.company.companyName }.map { it.toAccountDto() }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: CreateAccountDto): AccountDto {
        val companyCNPJ = CNPJ(dto.companyCNPJ)
        val headquarterCNPJ = dto.headquarterCNPJ?.let { CNPJ(it) }
        val company = abstractCompanyService.create(companyCNPJ, dto.companyName, headquarterCNPJ, dto.companyType)
        val account = accountService.create(company, dto.username, dto.password, dto.role)
        return account.toAccountDto()
    }

    @PostMapping("/{accountCNPJ}/change-password")
    fun changePassword(@PathVariable accountCNPJ: String, @RequestBody dto: PasswordDto): AccountDto {
        return accountService.changePassword(CNPJ(accountCNPJ), dto.password).toAccountDto()
    }

    @GetMapping("/headquarters-available")
    fun headquartersAvailable(): List<AccountDto> {
        return accountService.headquartersAvailable().map { it.toAccountDto() }
    }
}