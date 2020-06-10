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
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    //Create a new user
    const newUser = new User({ email, password });
    await newUser.save();

    //Generate token
    const token = signToken(newUser);

    //Respond with token
    res.status(200).json({ token });
  },

  signIn: async(req, res, next) => {
    console.log('UsersController.signIn() called!');
  },

  secret: async(req, res, next) => {
    console.log('UsersController.secret() called!');
    res.json({ secret: 'resource'})
  }
}