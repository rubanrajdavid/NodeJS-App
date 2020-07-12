const mysql_lib = require("mysql");
const mysql = mysql_lib.createConnection({
    host: "localhost",
    user: "root",
    database: "cron_example",
});

function check_if_user_exists(email_id) {
    let sql_query = "SELECT * FROM user_data WHERE EMAIL = ?";
    return new Promise((resolve, reject) => {
        mysql.query(sql_query, [email_id], (err, rows, fields) => {
            if (err != null) {
                reject(err);
            } else if (rows.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}
module.exports = {
    check_if_user_exists
};