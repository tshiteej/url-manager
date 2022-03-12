const Sequelize = require('sequelize')
const fs = require('fs');

const postgresqlUri = process.env.P_URI;

const conn = new URL(postgresqlUri);
conn.search = conn.query = "";


module.exports = new Sequelize('defaultdb', 'avnadmin', '1LwNk1HegDNgeYS5', {
    host: 'urlmanager-tbhardwaj97-4039.aivencloud.com',
    port: 25786,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync('./ca.cer').toString(),
        }
    }
});