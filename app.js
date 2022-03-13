const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Call DB connection object
let db = require('./config/database')

// Database connection testing
db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
})

// Body Parser
app.use(express.urlencoded({ extended: false }));

app.use('/user', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/shortcut', require('./routes/shortcuts'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));