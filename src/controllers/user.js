const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const {
  mail_settings,
  mail_name
} = require("../configurations/mail_cred")
const {
  User,
  new_user
} = require("../models/User");

let controller = {
  listusers: (_req, res) => {
    User.findAll({
      raw: true,
    }).then((users) => {
      var data = users.map((users) => {
        return {
          name: users.FIRSTNAME,
          mail: users.EMAIL,
          contact: users.CONTACT_NUMBER,
        };
      });
      res.json(data);
    });
  },
  userdetails: (req, res) => {
    User.findAll({
        where: {
          EMAIL: req.params.mail,
        },
        raw: true,
      })
      .then((details) => {
        console.log(details);
        if (details.length != 0) {
          var data = details.map((details) => {
            return {
              firstName: details.FIRSTNAME,
              lastName: details.LASTNAME,
              mobile: details.CONTACT_NUMBER,
              email: details.EMAIL,
            };
          });
          res.json(data);
        } else {
          res.json({
            error: "No User Found,check Mail ID",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: error,
        });
      });
  },
  check_if_user_exists: (email_id) => {
    return new Promise((resolve, reject) => {
      User.findAll({
          where: {
            EMAIL: email_id,
          },
          raw: true,
        })
        .then((details) => {
          if (details.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  check_if_user_already_registered: (email_id) => {
    return new Promise((resolve, reject) => {
      new_user
        .findAll({
          where: {
            mail: email_id,
          },
          raw: true,
        })
        .then((details) => {
          if (details.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  generateOTP: (size) => {
    var string =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = "";
    var len = string.length;
    for (let i = 0; i < size; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
  },
  create_unverified_new_user: (email_id, name, user_otp) => {
    new_user
      .create({
        mail: email_id,
        name: name,
        otp: user_otp,
      })
      .then((new_user) => {
        console.log(new_user);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  update_unverified_new_user: (email_id, name, user_otp) => {
    new_user.update({
      name: name,
      otp: user_otp,
    }, {
      where: {
        mail: email_id,
      },
    }, );
    return user_otp;
  },
  send_verification_mail: async (email_id, name, user_otp) => {
    let transporter = nodemailer.createTransport(mail_settings);
    let info = await transporter.sendMail({
      from: '"' + mail_name + '" <' + mail_settings.auth.user + '>',
      to: name + "," + email_id,
      subject: "Verification Mail",
      text: "",
      html: `<a href="http://localhost:3002/user/verify/` +
        user_otp +
        `">Click Here to register in NodeJS API Server</a>`,
    });
    console.log("Message sent: %s", info.messageId);
  },
  verify_url: (req, res) => {
    new_user
      .findAll({
        where: {
          otp: req.params.otp,
        },
        raw: true,
      })
      .then((details) => {
        console.log(details);
        if (details.length != 0) {
          res.render("register", {
            otp: details[0].otp,
            mail: details[0].mail,
          });
        } else {
          res.json({
            error: "Link Expired please re-register",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: error,
        });
      });
  },
  create_user: (req, res) => {
    controller.check_if_user_exists(req.body.mail).then((x) => {
      if (!x) {
        controller
          .check_if_user_already_registered(req.body.mail)
          .then((user_registered) => {
            if (!user_registered) {
              let user_otp = controller.generateOTP(15);
              controller.create_unverified_new_user(
                req.body.mail,
                req.body.name,
                user_otp,
              );
              console.log("New User , proceeding with E-Mail Verification");
              controller
                .send_verification_mail(req.body.mail, req.body.name, user_otp)
                .then(() => {
                  console.log("Mail Sent");
                  res.json({
                    status: "Mail Sent"
                  })
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              let user_otp = controller.generateOTP(15);
              controller.update_unverified_new_user(
                req.body.mail,
                req.body.name,
                user_otp,
              );
              console.log("Resending Verification E-Mail");
              controller
                .send_verification_mail(req.body.mail, req.body.name, user_otp)
                .then(() => {
                  console.log("Mail Sent");
                  res.json({
                    status: "Mail Sent"
                  })
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("Existing User");
        res.json({
          status: "Email is Already in use Please Login",
        });
      }
    });
  },
  register: (req, res) => {
    new_user
      .findAll({
        where: {
          otp: req.body.otp,
        },
        raw: true,
      })
      .then((details) => {
        console.log(details);
        if (details.length != 0) {
          controller.hash_password(req.body.password[0]).then((password) => {
            User.create({
              FIRSTNAME: req.body.firstName,
              LASTNAME: req.body.lastName,
              PASSWORD: password,
              EMAIL: req.body.email,
              CONTACT_NUMBER: req.body.contactNumber,
            });
            new_user
              .destroy({
                where: {
                  mail: req.body.email,
                },
              })
              .then(() => {
                res.json({
                  status: "User Registered Successfully",
                });
              });
            console.log("main function", password);
          });
        } else {
          res.json({
            error: "Unauthorised User Verification",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: error,
        });
      });
    console.log(req.body);
  },
  register_html: (req, res) => {
    res.render("create_user");
  },
  hash_password: async (password) => {
    try {
      let salt = await bcrypt.genSalt();
      let hashed_password = await bcrypt.hash(password, salt);
      console.log("function", hashed_password);
      return hashed_password;
    } catch (error) {
      console.log("Hash Error", error);
    }
  },
  login: (req, res) => {
    User.findAll({
        where: {
          EMAIL: req.body.mail,
        },
        raw: true,
      })
      .then((details) => {
        if (details.length == 0) {
          res.json({
            status: "Unregistered User"
          });
        } else {
          bcrypt
            .compare(req.body.password, details[0].PASSWORD)
            .then((result) => {
              if (result) {
                res.json({
                  status: "Authentication Successful",
                });
              } else {
                res.json({
                  status: "Username / Password is Wrong",
                });
              }
            })
            .catch((error) => {
              res.json({
                error,
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  login_html: (req, res) => {
    res.render("login");
  },
};

module.exports = controller;