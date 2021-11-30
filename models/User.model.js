const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
     name:{
        type:String,
        required : [true, 'please provide name'],
        minlength:3,
        maxlength:50,
     },
     email:{
         type:String,
         required : [true, 'please provide email'],
         match : [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
         unique : true,
     },
     password:{
        type:String,
        required : [true, 'please provide password'],
        minlength:6,
     },
})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.createJWT = function() {
    return  jwt.sign({id : this._id, username : this.name }, process.env.JWT_SECRET, {expiresIn : process.env.JWT_REFRESH_EXPIRATION_DAYS})
     
}

UserSchema.methods.checkPassword = function(password){
    hashPassword = this.password
    return bcrypt.compare(password, hashPassword)
}

module.exports = mongoose.model('User', UserSchema)