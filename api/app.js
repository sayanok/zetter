const express = require('express');
const cors = require('cors');
const app = express();
const zetter = require('./data/tweets.js');
const zetter_routes = require('./routes/zetter.js');
require('dotenv').config();

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api/zetter', zetter_routes);
