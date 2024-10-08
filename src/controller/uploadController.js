const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/requestModel');
const Product = require('../models/productModel');
const CsvProcessor = require('../services/csvprocessServices');
const queue = require('../utils/queue');

const upload = multer({ storage: multer.memoryStorage() });

const uploadController = {
    upload: [
        upload.single('csv'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const requestId = uuidv4();

                // Create new request record
                await Request.create({ requestId });

                // Parse CSV
                const products = await CsvProcessor.parseCsv(req.file.buffer);

                // Create product records
                await Promise.all(products.map(product =>
                    Product.create({
                        requestId,
                        serialNumber: product['S. No.'],
                        productName: product['Product Name'],
                        inputImageUrls: product['Input Image Urls'].split(',').map(url => url.trim()),
                    })
                ));

                // Add to processing queue
                queue.add('processImages', { requestId });

                res.status(200).json({ requestId });
            } catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({ error: 'Upload failed' });
            }
        }
    ]
};

module.exports = uploadController;