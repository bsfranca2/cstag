package br.com.cstag.core.repositories

import br.com.cstag.core.entities.Storage
import org.springframework.data.repository.CrudRepository

interface StorageRepository : CrudRepository<Storage, Long>