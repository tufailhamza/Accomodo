const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongose = require('passport-local-mongoose');
const UserSchema= new Schema({
    username:
    {
        type:String,
        required:true,
        unique : true
    },
    email:{
        type:String,
        required: true,
        unique:true
    }
});
UserSchema.plugin(passportlocalMongose);
module.exports = mongoose.model('User',UserSchema)