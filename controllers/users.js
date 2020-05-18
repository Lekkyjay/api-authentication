module.exports = {
  signUp: async(req, res, next) => {
    console.log('UsersController.signUp() called!');
    console.log('Content of req.value.body', req.value.body);
    next();
  },

  signIn: async(req, res, next) => {
    console.log('UsersController.signIn() called!');
  },

  secret: async(req, res, next) => {
    console.log('UsersController.secret() called!');
  }
}