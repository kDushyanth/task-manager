const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:String,
   hash:String,
   salt:String
});
const UserModel = mongoose.model('user',UserSchema);

module.exports = {UserSchema:UserSchema,UserModel:UserModel};