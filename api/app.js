const express = require('express');
const app = express();
const zetter = require('./data.js');
const zetter_routes = require('./routes/zetter.js');

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});

app.use(express.json());
app.use('/api/zetter', zetter_routes);
