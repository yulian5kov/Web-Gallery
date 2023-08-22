const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static register method
// needs to use normal function (not arrow), otherwise "this" wouldn't reference correctly
userSchema.statics.register = async function(username, email, password) {

    // validation
    if(!email || !password || !username){
      throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
      throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
      throw Error('Password not strong enough')
    }

    const EmailExists = await this.findOne({email})
    const UsernameExists = await this.findOne({username})
    
    if(EmailExists){
        throw Error('Email already in use')
    }
    
    if(UsernameExists){
        throw Error('Username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    const user = await this.create({username, email, password: hash})

    return user
}

//static login method
userSchema.statics.login = async function(usernameOrEmail, password) {
  
  // validation
  if(!usernameOrEmail  || !password){
    throw Error('All fields must be filled')
  }

  // Check if the input is an email
  const isEmail = validator.isEmail(usernameOrEmail);
  let user
  if (isEmail) {
    user = await this.findOne({ email: usernameOrEmail });
  } else {
    user = await this.findOne({ username: usernameOrEmail });
  }

    
  if(!user){
      throw Error('Incorrect username or email')
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error('Incorrect password')
  }

  return user
} 

module.exports = mongoose.model('User', userSchema)