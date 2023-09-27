package br.com.cstag.core.gateways

import java.io.File
import java.time.LocalDateTime

interface ExcelGateway {
    fun read(file: File): Workbook
}

interface Workbook {
    var sheets: List<Sheet>
}

interface Sheet {
    var rows: List<Row>
}

interface Row {
    var cells: List<Cell>
}

interface Cell {
    var index: Int
    fun stringCellValue(): String
    fun numericCellValue(): Double
    fun localDateTimeValue(): LocalDateTime
}

fun MutableList<Row>.withoutHeader(): MutableList<Row> {
    this.removeFirst()
    return this
}
