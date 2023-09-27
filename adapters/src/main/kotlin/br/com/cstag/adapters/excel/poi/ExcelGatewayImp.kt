package br.com.cstag.adapters.excel.poi

import br.com.cstag.core.gateways.*
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import java.io.File
import java.io.FileInputStream
import java.time.LocalDateTime

class ExcelGatewayImp : ExcelGateway {
    override fun read(file: File): Workbook {
        val fileInputStream = FileInputStream(file)
        val workbook = XSSFWorkbook(fileInputStream)
        fileInputStream.close()
        return workbook.toWorkbookImp()
    }
}

data class WorkbookImp(
    override var sheets: List<Sheet>
) : Workbook

fun XSSFWorkbook.toWorkbookImp(): WorkbookImp {
    val sheets = mutableListOf<SheetImp>()
    this.forEach { sheet ->
        val rowIterator = sheet.rowIterator()
        val rows = mutableListOf<RowImp>()
        while (rowIterator.hasNext()) {
            val row = rowIterator.next()
            rows.add(row.toRowImp())
        }
        sheets.add(SheetImp(rows))
    }
    return WorkbookImp(sheets)
}

class SheetImp(
    override var rows: List<Row>
) : Sheet

class RowImp(
    override var cells: List<Cell>
) : Row

fun org.apache.poi.ss.usermodel.Row.toRowImp(): RowImp {
    val cellIterator = cellIterator()
    val cellList = mutableListOf<CellImp>()
    while (cellIterator.hasNext()) {
        val cell = cellIterator.next()
        cellList.add(CellImp(cell))
    }
    return RowImp(cellList)
}

class CellImp(
    private var cell: org.apache.poi.ss.usermodel.Cell
): Cell {
    override var index = cell.columnIndex

    override fun stringCellValue(): String {
        return cell.stringCellValue
    }

    override fun numericCellValue(): Double {
        return cell.numericCellValue
    }

    override fun localDateTimeValue(): LocalDateTime {
        return cell.localDateTimeCellValue
    }
}
