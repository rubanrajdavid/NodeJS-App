const mysql_lib = require("mysql");
//SQL Connection Settings
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
        resolve("UDE");
      } else {
        resolve("UE");
      }
    });
  });
}

check_if_user_exists("rajruban.d@gmail.com")
  .then((x) => {
    console.log(x);
  })
  .catch((e) => {
    console.log(e);
  });
