const Sequelize = require("sequelize");
const db = require("../../configurations/sqlconnection")

const room_data = db.define('room_data', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CREATED_BY: {
        type: Sequelize.STRING
    },
    PARTICIPANTS: {
        type: Sequelize.STRING
    },
    ADMIN_ID: {
        type: Sequelize.STRING
    },
    UID: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true,
})

module.exports = {
    room_data: room_data
}