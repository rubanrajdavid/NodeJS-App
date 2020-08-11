const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Load User model
const {
  User,
  new_user,
  pwd_reset
} = require("../../models/user/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({
        usernameField: "mail",
      },
      (mail, password, done) => {
        User.findAll({
            where: {
              EMAIL: mail,
            },
            raw: true,
          })
          .then((details) => {
            if (details.length == 0) {
              return done(null, false, {
                message: `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                User ID is not found. Check User ID or Create a New Account below.
                                               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                 <span aria-hidden="true">&times;</span>
                                               </button>
                                             </div>`,
              });
            } else if (details[0].ALLOWED == 0) {
              return done(null, false, {
                message: `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                Password Reset Request has been Initiated and not completed. Please Complete the process and try again.
                                               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                 <span aria-hidden="true">&times;</span>
                                               </button>
                                             </div>`,
              });
            } else {
              console.log(details[0].PASSWORD);
              bcrypt
                .compare(password, details[0].PASSWORD)
                .then((result) => {
                  console.log(result);
                  if (result) {
                    const user = {
                      id: details[0].ID,
                      user: details[0].EMAIL,
                      name: details[0].FIRSTNAME,
                    };
                    return done(null, user);
                  } else {
                    return done(null, false, {
                      message: `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                             Username / Password is Wrong
                                               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                 <span aria-hidden="true">&times;</span>
                                               </button>
                                             </div>`,
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findAll({
      where: {
        ID: id,
      },
      raw: true,
    }).then((user) => {
      return done(null, user[0]);
    });
  });
};