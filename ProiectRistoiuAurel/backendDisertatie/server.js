import cors from 'cors';
import express from 'express';
const app = express();
const PORT = 3001;
import {router} from "./routes/clients.js";


app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use('/api', router);


const server = app.listen( PORT, () => {
    console.log(`App microservice listening on port ${PORT}`);
})

