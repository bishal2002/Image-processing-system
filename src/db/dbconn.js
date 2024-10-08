const mongoose = require('mongoose');
let MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imageprocessingsystem';

mongoose.set('strictQuery', false);
exports.connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected with DB successfully');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};