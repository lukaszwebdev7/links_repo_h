const express = require('express');
const router = express.Router();

const { getAllLinks, getSingleLink, createLink, updateLink, deleteLink } = require('../controllers/links');

router.route('/query').get(getAllLinks);
router.route('/').post(createLink);
router.route('/:id').get(getSingleLink).patch(updateLink).delete(deleteLink);

module.exports = router;
