
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const app = express();
require('dotenv').config();

//import db
const { connectDB } = require('./src/db/dbconn');

(async () => {
    await connectDB();
})();

app.use(express.json());
app.use('/api/v1', routes);

let port = process.env.PORT || 5001

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});