const express = require('express');
const cors = require('cors');
const app = express();
const zetter = require('./data/tweets.js');
const zetter_routes = require('./routes/zetter.js');

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});

app.use(express.json());
app.use(cors());
app.use('/api/zetter', zetter_routes);
