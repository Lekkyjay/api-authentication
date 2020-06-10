const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

    //Respond with token
    const token = jwt.sign({
      iss: 'lakeside',
      sub: newUser.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1) //current time + 1day
    }, 'lakesideauthentication');

    //Respond with token
    res.status(200).json({ token });
  },

  signIn: async(req, res, next) => {
    console.log('UsersController.signIn() called!');
  },

  secret: async(req, res, next) => {
    console.log('UsersController.secret() called!');
  }
}