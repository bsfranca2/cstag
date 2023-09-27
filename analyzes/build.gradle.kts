java.sourceCompatibility = JavaVersion.VERSION_1_8

dependencies {
	implementation(project(":adapters"))
	implementation(project(":core"))
	implementation("org.springframework.boot:spring-boot-starter-amqp")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.amqp:spring-rabbit-test")
}
