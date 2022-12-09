const passport = require('passport');
const passportJwt = require('passport-jwt');
const session = require('express-session');
const { SECRET_KEY } = require('./constants');
const { User } = require('../models');

module.exports = function (app) {
  passport.use(
    'jwt',
    new passportJwt.Strategy(
      {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: SECRET_KEY,
        session: false,
      },
      (payload, done) => done(null, payload)
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  // required for passport
  app.use(
    session({
      secret: 'SECRET',
      resave: true,
      saveUninitialized: true,
    })
  ); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  // app.use(flash()); // use connect-flash for flash messages stored in session
};
