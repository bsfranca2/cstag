package br.com.cstag.core.entities

import br.com.cstag.core.enums.ImportStatus
import java.time.LocalDate
import javax.persistence.*

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
    @OneToMany(targetEntity = TollPlaza::class, cascade = [CascadeType.ALL], mappedBy = "period")
    var tollPlazaList: MutableList<TollPlaza> = mutableListOf()
}