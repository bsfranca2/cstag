package br.com.cstag.core.services.trailer

import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.Trailer
import br.com.cstag.core.repositories.TrailerRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class TrailerService(
    private val trailerRepository: TrailerRepository
) {
    fun findAll(account: Account): MutableList<Trailer> {
        return account.company.getShippingCompany().trailers
    }

    @Transactional
    fun save(trailer: Trailer): Trailer {
        return trailerRepository.save(trailer)
    }
}