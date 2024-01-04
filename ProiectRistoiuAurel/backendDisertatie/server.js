var cors = require('cors');
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path')



app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use('/api/files', express.static(path.join(__dirname, 'resources')))

app.use('/api', require('./routes/clients'));

const server = app.listen( PORT, () => {
    console.log(`App microservice listening on port ${PORT}`);
})

