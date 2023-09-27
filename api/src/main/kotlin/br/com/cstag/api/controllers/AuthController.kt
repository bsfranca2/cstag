package br.com.cstag.api.controllers

import br.com.cstag.api.dto.*
import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.api.services.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController {
    @Autowired
    lateinit var authService: AuthService
    @Autowired
    lateinit var accountLoggedContextService: AccountLoggedContextService

    @PostMapping("/login")
    fun authenticate(@RequestBody dto: LoginRequestDto): TokenDto {
        return authService.authenticate(dto.username, dto.password).toTokenDto()
    }

    @GetMapping("/check")
    fun check(): AccountDto {
        return accountLoggedContextService.getAccount().toAccountDto()
    }
}