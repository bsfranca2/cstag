package br.com.cstag.core.repositories

import br.com.cstag.core.entities.AbstractCompany
import br.com.cstag.core.valueobjects.CNPJ
import org.springframework.data.repository.CrudRepository

interface AbstractCompanyRepository : CrudRepository<AbstractCompany, CNPJ>