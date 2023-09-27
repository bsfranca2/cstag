package br.com.cstag.core.services.invoice.semparar

import java.time.LocalDateTime

object FieldRetrieverUtil {
    fun getPaidAt(date: String, time: String): LocalDateTime {
        try {
            date.let {
                time.let { time ->
                    val (day, month, year) = date.split("/").map { it.toInt() }
                    val (hour, minute) = time.split(":").map { it.toInt() }
                    return LocalDateTime.of(year, month, day, hour, minute)
                }
            }
        } catch(e: Exception) {
            throw RuntimeException("Error creating date")
        }
    }
}