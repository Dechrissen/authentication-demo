const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'password cannot be blank']
    }
})

userSchema.statics.findAndValidate = async function (username, password) {
    // look up a user
    const foundUser = await this.findOne({ username });
    // then we validate and compare with bcrypt
    const isValid = await bcrypt.compare(password, foundUser.password);
    // ternary operator
    return isValid? foundUser : false;
}

// middleware to run hashing function before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);