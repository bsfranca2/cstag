package br.com.cstag.core.entities

import javax.persistence.*

@Entity
@Table(name = "storage_objects")
data class ObjectStorage(
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "storage_id")
    val storage: Storage,
    val objectName: String,
    val contentType: String,
    val url: String,
    val metadata: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = -1
}