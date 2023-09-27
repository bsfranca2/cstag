package br.com.cstag.core.gateways

import java.io.File

interface StorageGateway {
    fun putObject(bucketName: String, objectName: String, file: File)
    fun getObject(bucketName: String, objectName: String): File
}