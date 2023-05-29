const mysql = require('mysql');
const{promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Coneccion a bd cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene varias conexiones del');
        }
        if (err.code === 'ENCNCONREFUSED') {
            console.error('Conexion rechazada');
        }
    }
    if(connection) connection.release();
    console.log('BD conectada');
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;
