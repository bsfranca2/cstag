import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    val kotlinVersion = "1.4.31"
    val springVersion = "2.4.4"
    val springDependencyManagementVersion = "1.0.11.RELEASE"

    kotlin("jvm") version kotlinVersion apply false
    kotlin("plugin.spring") version kotlinVersion apply false
    kotlin("plugin.jpa") version kotlinVersion apply false
    id("org.springframework.boot") version springVersion apply false
    id("io.spring.dependency-management") version springDependencyManagementVersion
}

allprojects {
    group = "br.com.cstag"
    version = "1.0.0"

    repositories {
        mavenCentral()
    }
}

subprojects {
    println("Enabling Spring Boot plugin in project ${project.name}...")
    apply {
        plugin("org.jetbrains.kotlin.jvm")
        plugin("org.jetbrains.kotlin.plugin.spring")
        plugin("org.springframework.boot")
        plugin("io.spring.dependency-management")
    }

    tasks.withType<KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "1.8"
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }

    if (project.name == "core" || project.name == "adapters") {
        tasks {
            getByName<Jar>("jar") {
                enabled = true
            }

            getByName<BootJar>("bootJar") {
                enabled = false
            }
        }
    }
}