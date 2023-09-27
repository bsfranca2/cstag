package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "TollValleyCredit")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "operator_company", discriminatorType = DiscriminatorType.STRING)
abstract class TollValleyCredit(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    open var id: Long,
    @Embedded
    @AttributeOverride(name = "value", column = Column(name = "license_plate"))
    open var licensePlate: LicensePlate,
    open var category: Int,
    open var value: BigDecimal,
    open var receivedAt: LocalDateTime,
    @Enumerated(EnumType.STRING)
    open var status: TollRegistryStatus,
    @Column(name = "operator_company")
    @Enumerated(EnumType.STRING)
    open var operatorCompany: OperatorCompany
) {
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id")
    open lateinit var invoice: Invoice
}
