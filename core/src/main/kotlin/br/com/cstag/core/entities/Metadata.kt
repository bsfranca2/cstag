package br.com.cstag.core.entities

class Metadata {
    val data: MutableMap<String, String> = mutableMapOf()

    fun getValue(key: String): String? {
        return data[key]
    }

    fun setKey(key: String, value: String) {
        data[key] = value
    }

    fun setKey(key: String, value: Any) {
        return setKey(key, value.toString())
    }

    fun removeKey(key: String) {
        data.remove(key)
    }
}