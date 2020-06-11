const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true,
      minlength: 6,
      maxlength: 255
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 1024
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

//Password is hashed before user is saved to db.
userSchema.pre('save', async function(next) {
  try {
    if (this.method !== 'local') {
      next();
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(this.local.password, salt)
    this.local.password = passwordHash
    next()
  }
  catch(error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password)
  }
  catch(error) {
    throw new Error(error)
  }
}

module.exports = mongoose.model('User', userSchema);