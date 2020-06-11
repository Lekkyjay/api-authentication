const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const User = require('./models/User')

//JWT STRATEGY
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async(payload, done) => {
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

//LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false)
    }
    //check if password is correct
    const isMAtch = await user.isValidPassword(password)
    if (!isMAtch) {
      return done(null, false)
    }
    //return the user with verified password
    done(null, user)
  }
  catch(error) {
    done(error, false)
  }
}))