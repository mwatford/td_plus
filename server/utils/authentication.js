const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Set up Auth0 configuration
const authConfig = {
  domain: "dev-mg9endvd.eu.auth0.com",
  clientId: "2mdeCAWlvBM4sdS7disJDhVRLXXUo4hZ",
  audience: 'https://api.tdp',
};

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-mg9endvd.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

module.exports = checkJwt;
