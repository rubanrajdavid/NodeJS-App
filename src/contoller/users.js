const bodyParser = require("body-parser");
const mysql = require("../model/sqlconnection")


let controller = {
    server_test: (req, res) => {
        res.sendFile('E:/Blog/NodeJS API Server/Codes/src/view/index.html')
    },
    listusers: (_req, res) => {
        mysql.query("SELECT * FROM user_data", (err, rows, fields) => {
            if (err != null) {
                res.json({
                    error: err.code,
                    code: err.errno,
                    message: err.message,
                });
            } else if (rows.length == 0) {
                res.sendStatus(204);
            } else {
                var details = rows.map((rows) => {
                    return {
                        name: rows.USER_NAME,
                        mail: rows.EMAIL,
                    };
                });
                res.json(details);
            }
        });
    },
    userdetails: (req, res) => {
        (req, res) => {
            let email = req.params.mail;
            let sql_query = "SELECT * FROM user_data WHERE EMAIL = ?";
            mysql.query(sql_query, [email], (err, rows, fields) => {
                if (err != null) {
                    res.json({
                        error: err.code,
                        code: err.errno,
                        message: err.message,
                    });
                } else if (rows.length == 0) {
                    res.sendStatus(204);
                } else {
                    var details = rows.map((rows) => {
                        return {
                            name: rows.USER_NAME,
                            mail: rows.EMAIL,
                        };
                    });
                    res.json(details);
                }
            });
        }
    },
    check_if_user_exists: (email_id) => {
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
    },
    create_user: (req, res) => {
        controller.check_if_user_exists(req.body.mail)
            .then((x) => {
                console.log(x);
            })
            .catch((e) => {
                console.log(e);
            });
        res.end();
    }
}

module.exports = controller