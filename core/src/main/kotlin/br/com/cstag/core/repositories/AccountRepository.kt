package br.com.cstag.core.repositories

import br.com.cstag.core.entities.Account
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface AccountRepository : CrudRepository<Account, CNPJ>