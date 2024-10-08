const Request = require('../models/requestModel');
const Product = require('../models/productModel');

const statusController = {
    getStatus: async (req, res) => {
        try {
            const { requestId } = req.params;

            const request = await Request.findOne({ requestId });
            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            const products = await Product.find({ requestId });

            res.status(200).json({
                requestId,
                status: request.status,
                products: products.map(p => ({
                    productName: p.productName,
                    status: p.status,
                    inputImageUrls: p.inputImageUrls,
                    outputImageUrls: p.outputImageUrls,
                }))
            });
        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({ error: 'Status check failed' });
        }
    }
};

module.exports = statusController;