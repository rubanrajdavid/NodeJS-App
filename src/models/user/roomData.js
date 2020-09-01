const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../../configurations/sqlconnection")

const roomData = db.define('room_data', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ROOM_NAME: {
        type: Sequelize.STRING
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
    roomData: roomData
}