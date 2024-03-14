const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String,
    role:String,
    code_User:String,
    status:String
}, {
    timestamps: true
});

module.exports = model('User', userSchema, 'User');