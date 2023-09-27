package br.com.cstag.adapters.searchengine.meili

import com.github.kittinunf.fuel.httpPost
import org.slf4j.LoggerFactory

class RestClient {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private var baseUrl = System.getenv("MEILI_URL")

    fun search(index: String, json: ByteArray): ByteArray? {
        val (_, _, result) = "$baseUrl/indexes/$index/search".httpPost()
            .body(json)
            .response()
        logger.info("Requisição de pesquisar finalizada")
        val (data, error) = result
        if (error != null) {
            logger.error(String(error.errorData))
            return null
        }
        return data
    }

    fun save(index: String, json: ByteArray) {
        val (_, _, result) = "$baseUrl/indexes/$index/documents".httpPost()
            .body(json)
            .response()
        logger.info("Requisição de salvar finalizada")
    }

    fun remove(index: String, json: ByteArray) {
        "$baseUrl/indexes/$index/documents/delete-batch".httpPost()
            .body(json)
            .response()
        logger.info("Requisição de apagar finalizada")
    }
}