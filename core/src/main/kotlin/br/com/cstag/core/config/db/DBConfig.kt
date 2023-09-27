package br.com.cstag.core.config.db

import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EntityScan(basePackages = [
    "br.com.cstag.core.entities",
    "br.com.cstag.core.valueobjects"
])
@EnableJpaRepositories(basePackages = [
    "br.com.cstag.core.repositories"
])
class DBConfig