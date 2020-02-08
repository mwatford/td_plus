const passport = require("passport");
const GooglePlusStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const keys = require("./keys");
const userService = require("../modules/user/index");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  const user = await userService.findById(id);
  done(null, user);
});

passport.use(
  "google",
  new GooglePlusStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/api/auth/google/redirect"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.find(profile.id, "google");

        if (!user) {
          user = await userService.createUser(profile, "google");
        }

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: "/api/auth/github/redirect"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.find(profile.id, "github");

        if (!user) {
          user = await userService.createUser(profile, "github");
        }

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
