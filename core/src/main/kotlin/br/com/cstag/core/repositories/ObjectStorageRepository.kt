package br.com.cstag.core.repositories

import br.com.cstag.core.entities.ObjectStorage
import org.springframework.data.repository.CrudRepository

interface ObjectStorageRepository : CrudRepository<ObjectStorage, Long>