require("dotenv").config();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const session = require("express-session");
const { mail_settings, mail_name } = require("../../configurations/mail_cred");
const { User, new_user, pwd_reset } = require("../../models/user/User");
const { raw } = require("body-parser");

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
          res.status(404).render("errors/unauthorised", {
            title: "User not Found",
            type: "User does'nt Exist",
            status:
              "Used ID Doesnt exist. Please check the Email ID entered Or Create a New Account from below",
            link: "/user/create",
            label: "Create New Account",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render("errors/unauthorised", {
          title: "Sorry....",
          type: "Internal Server Error",
          status:
            "An Error occured while trying to fetch your Account Details please try again later.",
          link: "/user/login",
          label: "Go to Login page",
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
    new_user.update(
      {
        name: name,
        otp: user_otp,
      },
      {
        where: {
          mail: email_id,
        },
      },
    );
    return user_otp;
  },
  send_verification_mail: async (email_id, name, user_otp, type) => {
    switch (type) {
      case 0:
        mail_html =
          `<a href="http://localhost:3002/user/verify/` +
          user_otp +
          `">Click Here to register in NodeJS API Server</a>`;
        break;
      case 1:
        mail_html =
          `<a href="http://localhost:3002/user/verify-reset/` +
          user_otp +
          `">Click Here to reset Password</a>`;
        break;
    }
    let transporter = nodemailer.createTransport(mail_settings);
    let info = await transporter.sendMail({
      from: '"' + mail_name + '" <' + mail_settings.auth.user + ">",
      to: name + "," + email_id,
      subject: "Verification Mail",
      text: "",
      html: mail_html,
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
          res.render("user/register", {
            otp: details[0].otp,
            mail: details[0].mail,
          });
        } else {
          res.status(498).render("errors/expired", {
            type: "Link Expired",
            status:
              "Register Link has been Expired. Try registering again from the Link below",
            link: "/user/create",
            label: "Create New Account",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render("errors/unauthorised", {
          title: "Sorry....",
          type: "Internal Server Error",
          status:
            "An Error occured while trying to verify your account please try again later.",
          link: "/user/login",
          label: "Go to Login page",
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
              const type = 0;
              controller
                .send_verification_mail(
                  req.body.mail,
                  req.body.name,
                  user_otp,
                  type,
                )
                .then(() => {
                  console.log("Mail Sent");
                  res.status(200).render("messages/mail_sent", {
                    title: "Verification Mail Sent",
                    type: "Sent Verification E-Mail",
                    status:
                      "Click the verification Link in your Mail to Register.",
                    link: "/user/login",
                    label: `or 
                    Go to Login Page`,
                  });
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
                  res.status(200).render("messages/mail_sent", {
                    title: "Verification Mail Resent",
                    type: "Resent Verification E-Mail",
                    status:
                      "Click the verification Link in your Mail to Register.",
                    link: "/user/login",
                    label: `or 
                    Go to Login Page`,
                  });
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
        res.status(409).render("messages/successful", {
          title: "Existing User",
          type: "Existing User",
          status: "User ID you entered already Exists. Please Login.",
          link: "/user/login",
          label: "Go to Login Page",
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
        console.log(req.body.password, "#265");
        if (details.length != 0) {
          controller.hash_password(req.body.password).then((password) => {
            User.create({
              FIRSTNAME: req.body.firstName,
              LASTNAME: req.body.lastName,
              PASSWORD: password,
              EMAIL: req.body.email,
              CONTACT_NUMBER: req.body.contactNumber,
              ALLOWED: 1,
            });
            new_user
              .destroy({
                where: {
                  mail: req.body.email,
                },
              })
              .then(() => {
                res.status(201).render("messages/successful", {
                  title: "Account Created",
                  type: "Account Successfully Created",
                  status: "You can now Login with valid Credentials",
                  link: "/user/login",
                  label: "Go to Login Page",
                });
              });
            console.log("main function", password);
          });
        } else {
          res.status(500).render("errors/unauthorised", {
            type: "Unauthorised Access",
            status:
              "You are Not Authorised to access the page Please Login/Sign Up",
            link: "/user/login",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render("errors/unauthorised", {
          title: "Sorry....",
          type: "Internal Server Error",
          status:
            "An Error occured while trying to Create your account please try again later.",
          link: "/user/login",
          label: "Go to Login page",
        });
      });
    console.log(req.body, "#340");
  },
  register_html: (req, res) => {
    res.render("user/create_user");
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
  login: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/user/homepage",
      failureRedirect: "/user/login",
      failureFlash: true,
    })(req, res, next);
  },
  reset_password_email: (mail) => {
    User.findAll({
      where: {
        EMAIL: mail,
      },
      raw: true,
    })
      .then((details) => {
        let user_otp = controller.generateOTP(15);
        console.log(details, 2);
        pwd_reset.create({
          EMAIL: details[0].EMAIL,
          OTP: user_otp,
        });
        console.log(details[0].EMAIL, details[0].FIRSTNAME, user_otp, 0);
        controller.send_verification_mail(
          details[0].EMAIL,
          details[0].FIRSTNAME,
          user_otp,
          0,
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
  login_html: (req, res) => {
    res.render("user/login");
  },
  forgot_pwd: (req, res) => {
    controller.check_if_user_exists(req.body.mail).then((x) => {
      if (x) {
        User.findAll({
          where: {
            EMAIL: req.body.mail,
          },
          raw: true,
        }).then((details) => {
          console.log(req.body.mail, "#397");
          let otp = controller.generateOTP(15);
          controller.send_verification_mail(
            req.body.mail,
            details[0].FIRSTNAME,
            otp,
            1,
          );
          User.update(
            {
              ALLOWED: 0,
            },
            {
              where: {
                EMAIL: req.body.mail,
              },
            },
          );
          pwd_reset
            .findAll({
              where: {
                EMAIL: req.body.mail,
              },
            })
            .then((details) => {
              if (details.length == 0) {
                pwd_reset
                  .create({
                    EMAIL: req.body.mail,
                    OTP: otp,
                  })
                  .then((details) => {
                    res.status(200).render("messages/mail_sent", {
                      title: "Verification Mail Sent",
                      type: "Verification E-Mail Sent",
                      status:
                        "Password Reset Verification Mail Sent Successfully. Check your E-Mail.",
                      link: "/user/login",
                      label: `or 
                  Go to Login Page`,
                    });
                    console.log("Password Reset OTP Generated Successfully");
                  })
                  .catch((err) => {
                    console.log("Password Reset OTP error : ", err);
                  });
              } else {
                pwd_reset
                  .update(
                    {
                      OTP: otp,
                    },
                    {
                      where: {
                        ID: details[0].ID,
                      },
                    },
                  )
                  .then((details) => {
                    res.status(200).render("messages/mail_sent", {
                      title: "Verification Mail Resent",
                      type: "Verification E-Mail Sent",
                      status:
                        "Password Reset Verification Mail Resent. Please check your E-Mail.",
                      link: "/user/login",
                      label: `or 
                  Go to Login Page`,
                    });
                    console.log("Update Password Reset OTP");
                  })
                  .catch((err) => {
                    console.log("Error in Update Password reset OTP : ", err);
                  });
              }
            });
        });
      } else {
        controller.check_if_user_already_registered(req.body.mail).then((y) => {
          if (!y) {
            res.status(404).render("errors/unauthorised", {
              title: "User not Found",
              type: "User does'nt Exist",
              status:
                "Used ID Doesnt exist. Please check the Email ID entered Or Create a New Account from below",
              link: "/user/create",
              label: "Create New Account",
            });
          } else {
            res.status(403).render("errors/unauthorised", {
              title: "Account Verification Incomplete",
              type: "Account Verification Incomplete",
              status:
                "Used ID is not verified. Please Verify Or Create a New Account from below",
              link: "/user/create",
              label: "Create New Account",
            });
          }
        });
      }
    });
  },
  forgot_pwd_html: (req, res) => {
    res.render("user/forgot_password");
  },
  forgot_pwd_mail_verify: (req, res) => {
    pwd_reset
      .findAll({
        where: {
          OTP: req.params.otp,
        },
        raw: true,
      })
      .then((details) => {
        console.log(details);
        if (details.length != 0) {
          res.render("user/reset_password", {
            otp: details[0].OTP,
            mail: details[0].EMAIL,
          });
        } else {
          res.status(498).render("errors/expired", {
            type: "Link Expired",
            status:
              "Reset Link has been Expired. Try resetting again from the Link below",
            link: "/user/reset_password",
            label: "Reset Password",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render("errors/unauthorised", {
          title: "Sorry....",
          type: "Internal Server Error",
          status:
            "An Error occured while trying to Verify your password Reset please try again later.",
          link: "/user/reset_password",
          label: "Reset Password",
        });
      });
  },
  forgot_pwd_change: (req, res) => {
    console.log(req.body, "575");
    User.findAll({
      where: {
        EMAIL: req.body.email,
      },
      raw: true,
    }).then((details) => {
      if (details.length != 0) {
        pwd_reset
          .findAll({
            where: {
              OTP: req.body.otp,
            },
          })
          .then((details) => {
            if (details.length != 0) {
              console.log("587");
              controller.hash_password(req.body.password).then((password) => {
                User.update(
                  {
                    PASSWORD: password,
                    ALLOWED: 1,
                  },
                  {
                    where: {
                      EMAIL: req.body.email,
                    },
                  },
                );
                pwd_reset
                  .destroy({
                    where: {
                      EMAIL: req.body.email,
                    },
                  })
                  .then((details) => {
                    res.status(200).render("messages/successful", {
                      title: "Password Changed",
                      type: "Password Changed Successfully",
                      status:
                        "Password Updated in your Profile. Please Login with new credentials.",
                      link: "/user/login",
                      label: "Go to Login Page",
                    });
                  });
              });
            } else {
              res.status(498).render("errors/expired", {
                type: "Link Expired",
                status:
                  "Reset Link has been Expired. Try resetting again from the Link below",
                link: "/user/reset-password",
                label: "Reset Password",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(500).render("errors/unauthorised", {
          title: "Unauthorised Access",
          type: "Unauthorised Access",
          status:
            "You are Not Authorised to access the page Please Login/Sign Up",
          link: "/user/login",
          label: "Go to Login Page",
        });
      }
    });
  },
  checkAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/user/login");
    }
  },
  checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/user/homepage");
    }
    next();
  },
  logout: (req, res) => {
    req.logOut();
    res.redirect("/user/login");
  },
  homepage_html: (req, res) => {
    res.render("home/homepage", {
      title: "Homepage",
      userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
      layout: 'homepageLayout'
    });
  },
  updateProfile: (req, res) => {
    res.render("user/profile", {
      title: "Profile",
      //userName: req.user.FIRSTNAME + " " + req.user.LASTNAME,
      layout: "homepageLayout"
    })
  }
};


module.exports = controller;
