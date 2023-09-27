package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
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

    @GetMapping
    fun getAll(): List<AccountDto> {
       return accountService.findAll().map { it.toAccountDto() }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody dto: CreateAccountDto): AccountDto {
        return accountService.create(dto.toAccount(), dto.headquarterCNPJ?.let { CNPJ(it) }).toAccountDto()
    }

    @PostMapping("/{accountCNPJ}/change-password")
    fun changePassword(@PathVariable accountCNPJ: String, @RequestBody dto: PasswordDto): AccountDto {
        return accountService.changePassword(CNPJ(accountCNPJ), dto.password).toAccountDto()
    }
}