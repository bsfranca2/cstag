import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.4.2"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	kotlin("jvm") version "1.4.21"
	kotlin("plugin.spring") version "1.4.21"
}

group = "br.com.cstag"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_1_8

repositories {
	mavenCentral()
}

dependencies {
	implementation("com.github.kittinunf.fuel:fuel-coroutines:2.3.1")
	implementation("com.github.kittinunf.fuel:fuel-gson:2.3.1")
	implementation("com.github.kittinunf.fuel:fuel:2.3.1")
	implementation("com.google.code.gson:gson:2.8.6")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	implementation("com.backblaze.b2:b2-sdk-core:4.0.0")
    implementation("com.backblaze.b2:b2-sdk-httpclient:4.0.0")
	implementation("org.apache.poi:poi-ooxml:4.1.2")
    implementation("org.apache.poi:poi:4.1.2")
	implementation(project(":core"))
	implementation("org.springframework.boot:spring-boot-starter-amqp")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.amqp:spring-rabbit-test")
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


tasks {
	getByName<Jar>("jar") {
		enabled = true
	}

	getByName<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
		enabled = false
	}
}