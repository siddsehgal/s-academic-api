import express from 'express';

const app = express();
const PORT = process.env.PORT || 5500;

app.get('/', (req, res, next) => {
    res.status(200).send({
        message: `Server running on ${
            process.env.BACKEND_URL || `http://localhost:${PORT}`
        }`,
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on ${
            process.env.BACKEND_URL || `http://localhost:${PORT}`
        }`
    );
});
