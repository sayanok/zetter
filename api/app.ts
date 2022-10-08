import express from 'express';
import zetter_routes from './routes/zetter';
import cors from 'cors';

const app: express.Express = express();
require('dotenv').config();

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});
app.use(express.json());
app.use(cors());
app.use('/api/zetter', zetter_routes);
app.use(express.static('public'));
