package br.com.cstag.adapters.token.jwt

import br.com.cstag.core.entities.Account
import br.com.cstag.core.valueobjects.Token
import br.com.cstag.core.gateways.TokenGateway
import io.jsonwebtoken.*
import org.slf4j.LoggerFactory
import java.util.*

class TokenGatewayImp : TokenGateway {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private var jwtSecret = System.getenv("JWT_SECRET")
    private var jwtExpirationInMs = System.getenv("JWT_EXPIRATION")

    override fun generate(account: Account): Token {
        val now = Date()
        val token = Jwts.builder()
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