package br.com.cstag.core.entities

import java.time.LocalDate
import javax.persistence.*

@Entity
@Table(name = "toll_plaza_find_result_cache")
data class TollPlazaFindResultCache(
    val highway: String,
    val category: Int,
    val startOfPeriod: LocalDate,
    val endOfPeriod: LocalDate?,
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "toll_plaza_idd")
    val tollPlaza: TollPlaza,
    val isVerified: Boolean,
    val hasLowProbabilityRate: Boolean,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1
    val period
        get() = LocalDateRange(startOfPeriod, endOfPeriod)
}