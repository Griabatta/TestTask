import express, { Application } from "express";


const app = express() as Application;
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());

app.use(express.json());



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;