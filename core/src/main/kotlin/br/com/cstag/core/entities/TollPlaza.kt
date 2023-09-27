package br.com.cstag.core.entities

import br.com.cstag.core.enums.ImportStatus
import br.com.cstag.core.enums.Source
import br.com.cstag.core.mappers.MetadataConverter
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.*

@Entity
@Table(name = "toll_plazas")
class TollPlaza(
    var associateCompany: String,
    var highway: String,
    var km: String,
    var category: Int,
    var value: BigDecimal,
    var fullRoadName: String,
    @Enumerated(EnumType.STRING)
    var source: Source,
)  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "period_id")
    lateinit var period: TollPlazaPeriod
    @Convert(converter = MetadataConverter::class)
    @Column(columnDefinition = "TEXT")
    var metadata: Metadata = Metadata()

    constructor(): this(
        associateCompany = "",
        highway = "",
        km = "",
        category = -1,
        value = BigDecimal.ZERO,
        fullRoadName = "",
        source = Source.Sheet,
    )
}


@Entity
@Table(name = "toll_plaza_periods")
data class TollPlazaPeriod(
    var startOfPeriod: LocalDate,
    var endOfPeriod: LocalDate?,
    @Enumerated(EnumType.STRING)
    var status: ImportStatus = ImportStatus.Pending
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = -1
    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "period")
    var tollPlazaList: MutableList<TollPlaza> = mutableListOf()

    fun getTollPlazasByCategory(category: Int): List<TollPlaza> {
        return tollPlazaList.filter { it.category == category }
    }
}