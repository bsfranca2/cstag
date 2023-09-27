package br.com.cstag.adapters.messagebroker.rabbit

import com.google.gson.*
import java.lang.reflect.Type
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.Instant
import java.time.ZoneOffset

object SerializationUtil {
    private val gson = GsonBuilder()
        .registerTypeAdapter(LocalDateTime::class.java, LocalDateTimeSerializer())
        .registerTypeAdapter(LocalDateTime::class.java, LocalDateTimeDeserializer())
        .create()
    fun <T> serialize(obj: T, clazz: Class<T>): ByteArray {
        return gson.toJson(obj, clazz).toByteArray(Charsets.UTF_8)
    }

    fun <T> deserialize(byteArray: ByteArray, clazz: Class<T>): T {
        return gson.fromJson(byteArray.toString(Charsets.UTF_8), clazz)
    }
}

class LocalDateTimeSerializer : JsonSerializer<LocalDateTime> {
    override fun serialize(src: LocalDateTime, typeOfSrc: Type, context: JsonSerializationContext): JsonElement {
        return JsonPrimitive(src.toInstant(ZoneOffset.UTC).toEpochMilli());
    }
}

class LocalDateTimeDeserializer : JsonDeserializer<LocalDateTime> {
    override fun deserialize(json: JsonElement, typeOfT: Type, context: JsonDeserializationContext): LocalDateTime {
        val instant = Instant.ofEpochMilli(json.asJsonPrimitive.asLong)
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault())
    }
}