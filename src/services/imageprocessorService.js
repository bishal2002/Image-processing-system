const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
    static async processImage(imageUrl) {
        try {
            // Download the image
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            // Process the image - compress by 50%
            const processedBuffer = await sharp(buffer)
                .jpeg({ quality: 50 })
                .toBuffer();

            // Here you would typically upload to a cloud storage service
            // Please add your url here
            return `https://processed-images.example.com/${path.basename(imageUrl)}`;
        } catch (error) {
            console.error(`Error processing image ${imageUrl}:`, error);
            throw error;
        }
    }
}

module.exports = ImageProcessor;