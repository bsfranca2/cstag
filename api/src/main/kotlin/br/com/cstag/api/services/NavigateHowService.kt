package br.com.cstag.api.services

import br.com.cstag.api.security.AccountLoggedContextService
import br.com.cstag.core.gateways.TokenGateway
import br.com.cstag.core.valueobjects.Token
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service

@Service
class NavigateHowService(
    private val accountLoggedContextService: AccountLoggedContextService,
    private val tokenGateway: TokenGateway
) {

    fun navigate(companyCNPJ: String): Token {
        val adminAuthority = SimpleGrantedAuthority("Admin")
        if (!accountLoggedContextService.getAuthenticationContext().authorities.contains(adminAuthority))
            throw RuntimeException("Usuário autenticado não tem permissão para tal ação.")
        val account = accountLoggedContextService.findAccountByCNPJ(companyCNPJ)
        return tokenGateway.generate(account)
    }

}