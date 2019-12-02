import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
