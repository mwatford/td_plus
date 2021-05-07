require('dotenv').config()
const jwt = require('jsonwebtoken')

const signToken = user => {
  const accessToken = jwt.sign(user, process.env.ACCESS_KEY, {
    algorithm: 'HS256',
  })

  return accessToken
}

const authenticateToken = (unprotectedRoutes = []) => (req, res, next) => {
  if (unprotectedRoutes.some(el => el === req.path)) return next()

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user
    next()
  })
}

module.exports = { authenticateToken, signToken }
