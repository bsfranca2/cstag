package br.com.cstag.api.security

import br.com.cstag.core.exceptions.NotFoundException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    private val getAccountLoggedContextService: GetAccountLoggedContextService
) : UserDetailsService {
    override fun loadUserByUsername(cnpj: String): UserDetails {
        val account = try {
            getAccountLoggedContextService.findAccountByCNPJ(cnpj)
        } catch (e: NotFoundException) {
            throw UsernameNotFoundException(e.message ?: e.localizedMessage, e)
        }
        return UserPrincipal(account.companyCNPJ, "", account.role)
    }
}