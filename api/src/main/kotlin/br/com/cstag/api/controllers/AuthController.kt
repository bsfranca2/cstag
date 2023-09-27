package br.com.cstag.api.controllers

import br.com.cstag.api.dto.AccountDto
import br.com.cstag.api.dto.LoginRequestDto
import br.com.cstag.api.dto.TokenDto
import br.com.cstag.api.dto.toTokenDto
import br.com.cstag.api.security.GetAccountLoggedContextService
import br.com.cstag.api.security.UserPrincipal
import br.com.cstag.core.services.AuthService
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController {
    @Autowired
    lateinit var authService: AuthService
    @Autowired
    lateinit var getAccountLoggedContextService: GetAccountLoggedContextService

    @PostMapping("/login")
    fun authenticate(@RequestBody dto: LoginRequestDto): TokenDto {
        return authService.authenticate(CNPJ(dto.cnpj), dto.password).toTokenDto()
    }

    @GetMapping("/check")
    fun check(): AccountDto {
        val userPrincipal = (getAccountLoggedContextService.getAuthenticationContext().principal as UserPrincipal)
        return getAccountLoggedContextService.findAccountByCNPJ(userPrincipal.accountCNPJ)
    }
}