var mysql = require('mysql')
var dbconfig = require('../config/connection.js');
var connection = mysql.createConnection(dbconfig);
console.log('create db connection');

exports.getConnection = function()
{
    return connection;
}