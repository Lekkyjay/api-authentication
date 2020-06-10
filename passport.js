const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const User = require('./models/User')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new jwtStrategy(opts, async(payload, done) => {
  try {
    //find the user specified in token
    const user = await User.findById(payload.sub)
    if (!user) {
      return done(null, false)
    }
    //returns user
    done(null, user)
  }
  catch(error) {
    done(error, false)
  }
}))