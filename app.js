import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Router from './src/routes/index.js';
import ConnectDB from './models/index.js';
import GlobalErrorHandler from './src/controllers/errorController.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5500;

// Connect to MongoDB
ConnectDB();

app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res, next) => {
    res.status(200).send({
        message: `Server running on ${
            process.env.IS_PROD === 'true'
                ? process.env.BACKEND_URL
                : `http://localhost:${PORT}`
        }`,
    });
});

app.use('/api', Router);

// Handle Global Errors
app.use(GlobalErrorHandler);

app.listen(PORT, () => {
    console.log(
        `Server running on ${
            process.env.IS_PROD === 'true'
                ? process.env.BACKEND_URL
                : `http://localhost:${PORT}`
        }`
    );
});
