package br.com.cstag.core.repositories

import br.com.cstag.core.entities.Trailer
import org.springframework.data.repository.CrudRepository

interface TrailerRepository : CrudRepository<Trailer, Long>