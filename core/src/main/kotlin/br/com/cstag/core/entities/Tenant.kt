package br.com.cstag.core.entities

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "tenants")
data class Tenant(
    @Id
    val id: String,
    val name: String,
)