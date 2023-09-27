package br.com.cstag.core.services

import br.com.cstag.core.entities.Account
import br.com.cstag.core.entities.Company
import br.com.cstag.core.entities.ShippingCompany
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class DefaultDataService {
    @Autowired
    lateinit var accountService: AccountService

    /*@PostConstruct
    fun create() {
        val password = "123456"
        val consult = Account(
            company = Company(
                cnpj = CNPJ("05370110000169"),
                companyName = "Consult Soluções"
            ),
            username = "consult",
            password = password,
            role = Account.Role.Admin
        )
        val duarte = Account(
            company = ShippingCompany(
                cnpj = CNPJ("61654125000120"),
                companyName = "Transportadora Duarte LTDA"
            ),
            username = "duarte",
            password = password,
            role = Account.Role.Client
        )
        kotlin.runCatching {
            accountService.findAccountByUsername("consult")
        }.onFailure {
            accountService.save(consult)
            accountService.save(duarte)
        }
    }*/
}