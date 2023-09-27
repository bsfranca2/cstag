package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table(name = "storages")
data class Storage(
    val provider: String,
    val endpoint: String,
    val region: String?,
    val accessKey: String,
    val secretKey: String,
    val bucketName: String,
    var isActive: Boolean,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = -1
}