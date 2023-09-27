package br.com.cstag.core.entities

import java.math.BigDecimal
import javax.persistence.*

@Entity(name = "TollPlaza")
@Table(name = "toll_plazas")
data class TollPlaza(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = -1,
    var associateId: Long,
    var associateCompKnownName: String,
    var entryId: Int,
    var roadCode: String,
    var km: String,
    var description: String,
    var category: Int,
    var value: BigDecimal,
) {
    @ManyToOne(targetEntity = TollPlazaPeriod::class, cascade = [CascadeType.DETACH])
    @JoinColumn(name = "period_id")
    lateinit var period: TollPlazaPeriod

    constructor(): this(
        associateId = -1,
        associateCompKnownName = "null",
        entryId = -1,
        roadCode = "null",
        km = "null",
        description = "null",
        category = -1,
        value = BigDecimal("-1")
    )
}