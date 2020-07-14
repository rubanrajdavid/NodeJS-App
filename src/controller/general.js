const bodyParser = require("body-parser");
const mysql = require("../model/sqlconnection")

let controller = {
    server_test: (req, res) => {
        res.sendFile('E:/Blog/NodeJS API Server/Codes/src/view/index.html')
    }
}

module.exports = controller