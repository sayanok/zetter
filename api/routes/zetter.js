const express = require('express');
const router = express.Router();

const { getTweets } = require('../controllers/zetter.js');

router.get('/', getTweets);

// router.get('/:productID', getProduct);

// router.post('/', createProduct);

// router.put('/:productID', updateProduct);

// router.delete('/:productID', deleteProduct);

module.exports = router;
