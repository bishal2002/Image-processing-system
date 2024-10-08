const express = require('express');
const router = express.Router();
const uploadController = require('../controller/uploadController');
const statusController = require('../controller/statusController');

router.post('/upload', uploadController.upload);
router.get('/status/:requestId', statusController.getStatus);

module.exports = router;