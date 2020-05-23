const mysql = require('mysql2');
const configs = require('../config/database.json');

const conn = mysql.createConnection({
    host: configs.host,
    user: configs.username,
    database: configs.database,
    port: configs.port,
    password: configs.password
});


module.exports = {
    connection: conn,
    executeQuery: (sql, params = null) => {
        return new Promise(function (resolve, reject) {
            try {


                if (params) {

                    conn.promise().query(sql, params, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }


                    });

                } else {
                    conn.promise().query(sql, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }


                    });
                }


            } catch (error) {
                reject(err);
            }
        });
    }


}