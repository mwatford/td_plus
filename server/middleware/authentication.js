const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const authConfig = require('./auth_config')

// Set up Auth0 configuration
// Define middleware that validates incoming bearer tokens
// using JWKS from dev-mg9endvd.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
})

// function fakeMiddleware(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   req.user = {
//     sub: token,
//   };

//   next();
// }

module.exports = checkJwt
