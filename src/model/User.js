const Sequelize = require("sequelize");
const db = require("./sqlconnection")

const User = db.define('user_data', {
    ID: {
        type: Sequelize.INTEGER
    },
    USER_NAME: {
        type: Sequelize.STRING
    },
    EMAIL: {
        type: Sequelize.STRING
    },
    CONTACT_NUMBER: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})

module.exports = User