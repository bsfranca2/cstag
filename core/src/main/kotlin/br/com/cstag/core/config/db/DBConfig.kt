package br.com.cstag.core.config.db

import org.elasticsearch.client.RestHighLevelClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.core.env.Environment
import org.springframework.data.convert.ReadingConverter
import org.springframework.data.convert.WritingConverter
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.RestClients
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration
import org.springframework.data.elasticsearch.core.convert.ElasticsearchCustomConversions
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId


@Configuration
@EntityScan(basePackages = [
    "br.com.cstag.core.entities"
])
@EnableJpaRepositories(basePackages = [
    "br.com.cstag.core.repositories"
])
class DBConfig

@Configuration
@EntityScan(basePackages = [
    "br.com.cstag.core.search.entities"
])
@EnableElasticsearchRepositories(basePackages = [
    "br.com.cstag.core.search.repositories"
])
class ElasticsearchConfig : AbstractElasticsearchConfiguration() {
    @Autowired
    lateinit var env: Environment

    override fun elasticsearchClient(): RestHighLevelClient {
        val builder = ClientConfiguration.builder()
            .connectedTo(env.getProperty("spring.elasticsearch.rest.uris"))
            .withBasicAuth("elastic", "changeme")
        val clientConfiguration = builder.build()
        return RestClients.create(clientConfiguration).rest()
    }

    @Bean
    override fun elasticsearchCustomConversions(): ElasticsearchCustomConversions {
        return ElasticsearchCustomConversions(
            arrayListOf(LocalDateTimeToLong(), LongToLocalDateTime())
        )
    }

    @WritingConverter
    class LocalDateTimeToLong : Converter<LocalDateTime, Long> {
        override fun convert(source: LocalDateTime): Long {
            return source.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        }
    }

    @ReadingConverter
    class LongToLocalDateTime : Converter<Long, LocalDateTime> {
        override fun convert(source: Long): LocalDateTime {
            return Instant.ofEpochMilli(source).atZone(ZoneId.systemDefault()).toLocalDateTime()
        }
    }
}