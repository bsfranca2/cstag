import EventEmitter from 'node:events';
import { PassThrough } from 'node:stream';
import { createLogger } from '@cstag/logger';
import XlsxStreamReader from 'xlsx-stream-reader';

const logger = createLogger('xlsx');

const _defaultProps = {
  sheets: [1],
  formatting: false,
};

export const getWorkbookData = (fileStream, options = _defaultProps) => {
  const eventEmitter = new EventEmitter();
  const workBookReader = new XlsxStreamReader({
    formatting: options.formatting,
  });

  workBookReader.on('error', function (error) {
    logger.error('Error reading workbook', error);
    eventEmitter.emit('error', error);
  });

  workBookReader.on('worksheet', function (workSheetReader) {
    if (!options.sheets.includes(Number(workSheetReader.id))) {
      // we only want first sheet
      workSheetReader.skip();
      return;
    }

    workSheetReader.on('row', function (row) {
      // skip header and empty rows
      if (row.attributes.r === '1' || row.values.length === 0) return;

      eventEmitter.emit('data', {
        sheet: Number(workSheetReader.id),
        row: row.values,
      });
    });

    workSheetReader.process();
  });
  workBookReader.on('end', function () {
    eventEmitter.emit('end');
  });

  fileStream.pipe(workBookReader);
  return eventEmitter;
};

export const getWorkbookStream = (workBookReader, batchSize = 20) => {
  const stream = new PassThrough({
    objectMode: true,
    highWaterMark: batchSize,
  });

  workBookReader.on('data', (data) => stream.write(data));
  workBookReader.on('error', (error) => stream.write(error));
  workBookReader.on('end', () => stream.end());
  return stream;
};
