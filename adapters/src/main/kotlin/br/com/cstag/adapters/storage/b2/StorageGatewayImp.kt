package br.com.cstag.adapters.storage.b2

import br.com.cstag.core.gateways.StorageGateway
import com.backblaze.b2.client.B2StorageClient
import com.backblaze.b2.client.B2StorageClientFactory
import com.backblaze.b2.client.contentHandlers.B2ContentMemoryWriter
import com.backblaze.b2.client.contentSources.B2ContentTypes
import com.backblaze.b2.client.contentSources.B2FileContentSource
import com.backblaze.b2.client.contentSources.B2Headers
import com.backblaze.b2.client.structures.B2DownloadByNameRequest
import com.backblaze.b2.client.structures.B2UploadFileRequest
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileOutputStream

open class StorageGatewayImp : StorageGateway {
    private val accessKey = System.getenv("B2_ACCESS_KEY")
    private val secretKey = System.getenv("B2_SECRET_KEY")
    private var b2Client: B2StorageClient = B2StorageClientFactory
        .createDefaultFactory()
        .create(accessKey, secretKey, B2Headers.USER_AGENT)

    override fun putObject(bucketName: String, objectName: String, file: File) {
        val bucket = b2Client.getBucketOrNullByName(bucketName)
        val source = B2FileContentSource.build(file)
        val request = B2UploadFileRequest.builder(bucket.bucketId, objectName, B2ContentTypes.B2_AUTO, source).build()
        b2Client.uploadSmallFile(request)
    }

    override fun getObject(bucketName: String, objectName: String): File {
        try {
            val downloadRequest = B2DownloadByNameRequest
                .builder(bucketName, objectName)
                .build()
            val downloadHandler = B2ContentMemoryWriter.build()
            b2Client.downloadByName(downloadRequest, downloadHandler)
            val byteArrayInputStream = ByteArrayInputStream(downloadHandler.bytes)
            return byteArrayInputStreamToFile(byteArrayInputStream)
        } catch (e: Exception) {
            throw e
        }
    }

    private fun byteArrayInputStreamToFile(byteArrayInputStream: ByteArrayInputStream): File {
        val newFile = File.createTempFile("b2-", "")
        val fos = FileOutputStream(newFile)
        var data: Int
        while (byteArrayInputStream.read().also { data = it } != -1) {
            val ch = data.toChar()
            fos.write(ch.toInt())
        }
        fos.flush()
        fos.close()
        return newFile
    }
}
