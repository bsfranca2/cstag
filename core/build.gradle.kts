plugins {
	kotlin("plugin.jpa")
}

java.sourceCompatibility = JavaVersion.VERSION_1_8

dependencies {
	implementation("com.google.code.gson:gson:2.8.6")
	implementation("org.springframework.boot:spring-boot-starter-data-elasticsearch")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}
