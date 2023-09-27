package br.com.cstag.analyzes

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import javax.annotation.PostConstruct

@SpringBootApplication
class AnalyzesApplication

fun main(args: Array<String>) {
	runApplication<AnalyzesApplication>(*args)
}
