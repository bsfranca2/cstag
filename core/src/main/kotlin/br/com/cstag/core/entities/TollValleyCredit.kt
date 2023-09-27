package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.Source
import br.com.cstag.core.mappers.MetadataConverter
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "toll_valley_credits")
class TollValleyCredit {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Long = -1
    var trip: String? = null
    var value: BigDecimal? = null
    @Embedded
    @AttributeOverride(name = "value", column = Column(name = "license_plate"))
    var licensePlate: LicensePlate? = null
    @Convert(converter = MetadataConverter::class)
    @Column(columnDefinition = "TEXT")
    var metadata = Metadata()
    @Enumerated(EnumType.STRING)
    var operatorCompany: OperatorCompany? = null
    var receivedAt: LocalDateTime? = null
    @Enumerated(EnumType.STRING)
    var source: Source? = null
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id")
    var invoice: Invoice? = null
}