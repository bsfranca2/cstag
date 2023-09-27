package br.com.cstag.core.mappers

import br.com.cstag.core.entities.Metadata
import com.google.gson.GsonBuilder
import javax.persistence.AttributeConverter
import javax.persistence.Converter

@Converter(autoApply = true)
class MetadataConverter : AttributeConverter<Metadata, String> {
    private val gson = GsonBuilder().create()

    override fun convertToDatabaseColumn(attribute: Metadata?): String {
        attribute?.let {
            return gson.toJson(it.data)
        }
        return ""
    }

    override fun convertToEntityAttribute(dbData: String?): Metadata {
        dbData?.let {
            val value = """{data: $it}"""
            return gson.fromJson(value, Metadata::class.java)
        }
        return Metadata()
    }
}
