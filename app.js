
const express = require('express');
require('dotenv').config();

const app = express();

let db = require('./config/database')
// Database connection testing
db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
})

app.use('/user', require('./routes/users'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));