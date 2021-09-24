const express = require('express');

const router = express.Router();

const reset = require('../controllers/password-reset');

router.route('/').post(reset);

module.exports = router;
