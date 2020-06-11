const jwt = require('jsonwebtoken');
const User = require('../models/User');

signToken = user => {
  return jwt.sign({
    iss: 'lakeside',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1) //current time + 1day
  }, process.env.JWT_SECRET);
}

module.exports = {
  signUp: async(req, res, next) => {
    const { email, password } = req.value.body;

    //Check if user already exist
    const foundUser = await User.findOne({"local.email": email });
    if (foundUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    //Create a new user
    const newUser = new User({
      method: 'local',
      local: {
        email: email, 
        password: password
      }
    });
    console.log(newUser)
    await newUser.save();

    //Generate token after user has been saved to db. 
    //Token is used for accessing protected resource at the secret route.
    const token = signToken(newUser);

    //Respond with token
    res.status(200).json({ token });
  },

  signIn: async(req, res, next) => {
    //Generate token after user signed in. 
    //Token is used for accessing protected resource at the secret route.
    const token = signToken(req.user)   //req.user is provided by passport from the signin route
    res.status(200).json({ token });
  },

  googleOAuth: async(req, res, next) => {
    //Generate token after user signed in/signed up. 
    //Token is used for accessing protected resource at the secret route.
    console.log('req.user:', req.user)
    const token = signToken(req.user)   //req.user is provided by passport from the signin route
    res.status(200).json({ token });
  },

  secret: async(req, res, next) => {
    console.log('Protected resource accessed!');
    res.json({ secret: 'resource'})
  }
}