package br.com.cstag.api.security

import br.com.cstag.api.dto.TokenDto
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthenticationFilter(
    private val accountLoggedContextService: AccountLoggedContextService
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val jwt = getJwtFromRequest(request)
            if (jwt.isNotBlank()) {
                val account = accountLoggedContextService.getAccountContext(TokenDto(jwt))
                val userPrincipal = UserPrincipal(account)
                val authentication = UsernamePasswordAuthenticationToken(
                    userPrincipal,
                    null,
                    userPrincipal.authorities
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (ex: Exception) {
            logger.error("Could not set user authentication in security context", ex)
        }
        filterChain.doFilter(request, response)
    }

    private fun getJwtFromRequest(request: HttpServletRequest): String {
        val bearerToken = request.getHeader("Authorization")
        var token = ""
        bearerToken?.let { it ->
            if (it.isNotBlank() && it.startsWith("Bearer ")) {
                token = it.substring(7, it.length)
            }
        }
        return token
    }
}