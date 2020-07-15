const bodyParser = require("body-parser");
const {
    User,
    new_user
} = require("../model/User")
// const new_user = require("../model/User")

let controller = {
    listusers: (_req, res) => {
        User.findAll({
            raw: true
        }).then((users) => {
            var data = users.map((users) => {
                return {
                    name: users.USER_NAME,
                    mail: users.EMAIL,
                    contact: users.CONTACT_NUMBER
                };
            })
            res.json(data)
        })
    },
    userdetails: (req, res) => {
        User.findAll({
            where: {
                EMAIL: req.params.mail
            },
            raw: true
        }).then((details) => {
            console.log(details)
            if (details.length != 0) {
                var data = details.map((details) => {
                    return {
                        name: details.USER_NAME,
                        mail: details.EMAIL,
                    };
                })
                res.json(data)
            } else {
                res.json({
                    error: "No User Found,check Mail ID"
                })
            }
        }).catch((error) => {
            console.log(error)
            res.json({
                error: error
            })
        });
    },
    check_if_user_exists: (email_id) => {
        return new Promise((resolve, reject) => {
            User.findAll({
                where: {
                    EMAIL: email_id
                },
                raw: true
            }).then((details) => {
                if (details.length == 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }).catch((error) => {
                reject(error)
            })
        });
    },
    generateOTP: (size) => {
        var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let OTP = '';
        var len = string.length;
        for (let i = 0; i < size; i++) {
            OTP += string[Math.floor(Math.random() * len)];
        }
        return OTP;
    },
    create_user: (req, res) => {
        controller.check_if_user_exists(req.body.mail)
            .then((x) => {
                if (!x) {
                    new_user.create({
                        mail: req.body.mail,
                        name: req.body.name,
                        otp: controller.generateOTP(15)
                    }).then((new_user) => {
                        console.log(new_user)
                    }).catch((error) => {
                        console.error(error)
                    })
                } else {
                    console.log("Existing User")
                }
            })
        res.end();
    }
}

module.exports = controller