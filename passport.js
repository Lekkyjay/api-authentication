const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token');
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

//GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)
    //Check if user exist in db
    const existingUser = await User.findOne({ 'google.id': profile.id })
    if (existingUser) {
      console.log('User already exist in our DB')
      return done(null, existingUser)
    }

    //if user is new, create new document in db
    console.log('New user will be created in our DB')
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
    }
    catch(error) {
      done(error, false, error.message)
    }
}));

//LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    console.log('email:', email)
    const user = await User.findOne({ 'local.email': email })
    if (!user) {
      return done(null, false)
    }
    //check if password is correct
    const isMAtch = await user.isValidPassword(password)
    console.log('isMatch:', isMAtch)
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