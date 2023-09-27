package br.com.cstag.core.entities

import br.com.cstag.core.enums.OperatorCompany
import br.com.cstag.core.enums.TollRegistryStatus
import br.com.cstag.core.valueobjects.LicensePlate
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.*

@Entity(name = "TollTicket")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "operator_company", discriminatorType = DiscriminatorType.STRING)
abstract class TollTicket(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    override var id: Long,
    override var highway: String,
    @Embedded
    @AttributeOverride(name = "value", column = Column(name = "license_plate"))
    override var licensePlate: LicensePlate,
    override var category: Int,
    override var fare: BigDecimal,
    override var paidAt: LocalDateTime,
    @Enumerated(EnumType.STRING)
    override var status: TollRegistryStatus,
    @Column(name = "operator_company")
    @Enumerated(EnumType.STRING)
    override var operatorCompany: OperatorCompany
) : BaseTicket {
    @OneToOne(mappedBy = "tollTicket", cascade = [CascadeType.ALL], orphanRemoval = true)
    override var analysis: TollTicketAnalysis? = null
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name =  "invoice_id")
    override lateinit var invoice: Invoice
    @Enumerated(EnumType.STRING)
    open var type: Type = Type.TollTicket

    enum class Type {
        TollTicket, TollValleyTicket
    }
}

