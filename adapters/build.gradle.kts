java.sourceCompatibility = JavaVersion.VERSION_1_8

dependencies {
	implementation("com.google.code.gson:gson:2.8.6")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	implementation("com.backblaze.b2:b2-sdk-core:4.0.0")
    implementation("com.backblaze.b2:b2-sdk-httpclient:4.0.0")
	implementation("org.apache.poi:poi-ooxml:4.1.2")
    implementation("org.apache.poi:poi:4.1.2")
	implementation(project(":core"))
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-amqp")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.amqp:spring-rabbit-test")
}
