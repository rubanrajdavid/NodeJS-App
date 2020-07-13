const mysql_lib = require("mysql");
const mysql = mysql_lib.createConnection({
    host: "localhost",
    user: "root",
    database: "cron_example",
});
module.exports = mysql