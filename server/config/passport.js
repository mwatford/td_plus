const passport = require("passport");
const GooglePlusStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const keys = require("./keys");

passport.use(
  "google",
  new GooglePlusStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      done();
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientID,
      callbackURL: "/auth/github/redirect"
    },
    (accessToken, refreshToken, profile, done) => {}
  )
);

module.exports = passport;
