const pg = require("pg");
const client = new pg.Client("postgres://localhost/wnews"); //address of database

client.connect();

module.exports = client;
