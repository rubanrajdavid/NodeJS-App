const Sequelize = require("sequelize");
const db = require("../../configurations/sqlconnection")

const User = db.define('user_data', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    FIRSTNAME: {
        type: Sequelize.STRING
    },
    LASTNAME: {
        type: Sequelize.STRING
    },
    PASSWORD: {
        type: Sequelize.STRING
    },
    EMAIL: {
        type: Sequelize.STRING
    },
    CONTACT_NUMBER: {
        type: Sequelize.INTEGER
    },
    ALLOWED: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})

const new_user = db.define('temp_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mail: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    otp: {
        type: Sequelize.STRING
    },
    registered_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
});

const pwd_reset = db.define('reset_password', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    EMAIL: {
        type: Sequelize.STRING
    },
    OTP: {
        type: Sequelize.STRING
    },
    CREATED_AT: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = {
    User: User,
    new_user: new_user,
    pwd_reset: pwd_reset
}