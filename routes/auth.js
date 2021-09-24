const express = require('express');

const router = express.Router();

const { login, passReset, register } = require('../controllers/auth');

router.route('/register').post(register);
router.route('/mailpasswordreset').post(passReset);
router.route('/login').post(login);

module.exports = router;
