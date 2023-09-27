package br.com.cstag.core.entities

import br.com.cstag.core.mappers.MetadataConverter
import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "monthly_payments")
data class MonthlyPayment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = -1,
    var licensePlate: String,
    var tag: String?,
    var month: Int,
    var year: Int,
    var value: BigDecimal,
    @Convert(converter = MetadataConverter::class)
    @Column(columnDefinition = "TEXT")
    var metadata: Metadata = Metadata()
) {
    @ManyToOne(cascade = [CascadeType.DETACH])
    @JoinColumn(name = "invoice_id")
    lateinit var invoice: Invoice

    class Builder {
        var licensePlate: String? = null
        var tag: String? = null
        var month: Int? = null
        var year: Int? = null
        var value: BigDecimal? = null
        var metadata = Metadata()

        fun build(): MonthlyPayment {
            if (licensePlate == null || month == null || year == null || value == null)
                throw RuntimeException("Faltando argumentos para a construção do MonthlyPayment")
            return MonthlyPayment(
                licensePlate = licensePlate!!,
                tag = tag,
                month = month!!,
                year = year!!,
                value = value!!,
                metadata = metadata
            )
        }
    }
}
