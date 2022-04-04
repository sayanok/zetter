const tweets = require('../data.js');

const getTweets = (req, res) => {
    res.json(tweets);
};

// const deleteProduct = (req, res) => {
//     const id = Number(req.params.productID);
//     const index = products.findIndex((product) => product.id === id);
//     products.splice(index, 1);
//     res.status(200).json('Product deleted');
// };

module.exports = {
    getTweets,
    // getProduct,
    // createProduct,
    // deleteProduct,
};
