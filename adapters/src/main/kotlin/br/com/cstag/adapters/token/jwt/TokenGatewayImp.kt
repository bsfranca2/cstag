package br.com.cstag.adapters.token.jwt

import br.com.cstag.core.entities.Account
import br.com.cstag.core.gateways.TokenGateway
import br.com.cstag.core.valueobjects.Token
import com.sun.org.slf4j.internal.LoggerFactory
import io.jsonwebtoken.*
import java.util.*

class TokenGatewayImp : TokenGateway {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private var jwtSecret = System.getenv("JWT_SECRET")
    private var jwtExpirationInMs = System.getenv("JWT_EXPIRATION")

    override fun generate(account: Account): Token {
        val now = Date()
        val claims = mapOf(
            "companyCNPJ" to account.company.cnpj.value,
            "companyName" to account.company.companyName,
            "role" to account.role
        )
        val token = Jwts.builder()
            .setClaims(claims)
            .setSubject(account.company.cnpj.value)
            .setIssuedAt(now)
            .setExpiration(Date(now.time.plus(jwtExpirationInMs.toInt())))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact()
        return Token(token)
    }

    override fun decode(token: Token): Map<String, String> {
        val claims = getClaims(token.value)
            ?: throw RuntimeException("Token inválido")
        return mapOf(
            "companyCNPJ" to claims.body["companyCNPJ"].toString(),
            "companyName" to claims.body["companyName"].toString(),
            "role" to claims.body["role"].toString()
        )
    }

    private fun getClaims(token: String): Jws<Claims>? {
        try {
            return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token)
        } catch (ex: SignatureException) {
            logger.error("Invalid JWT signature")
        } catch (ex: MalformedJwtException) {
            logger.error("Invalid JWT token")
        } catch (ex: ExpiredJwtException) {
            logger.error("Expired JWT token")
        } catch (ex: UnsupportedJwtException) {
            logger.error("Unsupported JWT token")
        } catch (ex: IllegalArgumentException) {
            logger.error("JWT claims string is empty.")
        }
        return null
    }
}