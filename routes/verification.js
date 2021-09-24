const express = require('express');

const router = express.Router();

const verification = require('../controllers/verification-email');

router.route('/:uniqueString').get(verification);

module.exports = router;
