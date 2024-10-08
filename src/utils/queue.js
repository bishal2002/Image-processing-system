const Queue = require('bull');
const ImageProcessor = require('../services/imageprocessorService');
const Product = require('../models/productModel');
const Request = require('../models/requestModel');
const axios = require('axios');

const imageQueue = new Queue('image-processing');

imageQueue.process('processImages', async (job) => {
    const { requestId } = job.data;

    try {
        await Request.findOneAndUpdate(
            { requestId },
            { status: 'processing' }
        );

        const products = await Product.find({ requestId });

        for (const product of products) {
            const outputUrls = [];

            for (const inputUrl of product.inputImageUrls) {
                const outputUrl = await ImageProcessor.processImage(inputUrl);
                outputUrls.push(outputUrl);
            }

            await Product.findByIdAndUpdate(product._id, {
                outputImageUrls: outputUrls,
                status: 'completed'
            });
        }

        await Request.findOneAndUpdate(
            { requestId },
            {
                status: 'completed',
                completedAt: new Date()
            }
        );

        // Trigger webhook if configured
        // if (process.env.WEBHOOK_URL) {
        //     await axios.post(process.env.WEBHOOK_URL, { requestId, status: 'completed' });
        // }

    } catch (error) {
        console.error(`Processing failed for request ${requestId}:`, error);
        await Request.findOneAndUpdate(
            { requestId },
            { status: 'failed' }
        );
        throw error;
    }
});

module.exports = imageQueue;