//mongoose uses mongoDB modules behind the scenes
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Use another password");
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
} , {
  timestamps: true
})


/*Virtual Property --> It is not actual data stored in the database . It's a relationship between two entities , in this case between our user and
 task*/  
 userSchema.virtual('tasks' , {
   //referefnce between user and task on a virtual
   ref: 'Task',
   //localField is where the local data will be stored
   localField: '_id',
   //foreignField is the name of the field on the other thing , in this task that's going to create this relationship  
   foreignField: 'owner'
 })

userSchema.methods.toJSON = function() {
  const user = this
  /**Documents have a toObject method which converts the mongoose document into a plain JavaScript object.  */
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.token
  delete userObject.avatar
  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

//definition of findByCredentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })//findOne is going to return a single user and is similar to findById 

  if (!user) {
    throw new Error('Unable to login')
}

const isMatch = await bcrypt.compare(password, user.password)

if (!isMatch) {
    throw new Error('Unable to login')
}

return user
}


//Hash the plain text password before saving
userSchema.pre('save' , async function(next) {
 const user = this
 //below condition will be true if user is created or if updated
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})


//Delete user tasks when user is removed
userSchema.pre('remove' ,async function(next) 
{
  const user = this
  await Task.deleteMany({owner: user._id})
  next()
} )

/*when we pass the object in the second argument , behind the scenes mongoose converts it into schema . In order to take advantage of the middleware
functiality , all we have do is create the schema amd pass it */
const User = mongoose.model("User", userSchema );


module.exports = User

  