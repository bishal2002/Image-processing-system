const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

class CsvProcessor {
    static validateCsvFormat(headers) {
        const requiredHeaders = ['S. No.', 'Product Name', 'Input Image Urls'];
        return requiredHeaders.every(header => headers.includes(header));
    }

    static async parseCsv(fileBuffer) {
        return new Promise((resolve, reject) => {
            const results = [];
            const readableStream = Readable.from(fileBuffer.toString());

            readableStream
                .pipe(csv())
                .on('headers', (headers) => {
                    if (!this.validateCsvFormat(headers)) {
                        reject(new Error('Invalid CSV format'));
                    }
                })
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }
}

module.exports = CsvProcessor;