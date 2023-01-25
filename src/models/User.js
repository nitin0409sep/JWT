const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Invalid Email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minlength: [5, 'Minimum password length is 5 characters']
    }
})


// fire a function after doc saved to db
userSchema.post('save', function (docSaved, next) {
    // console.log(docSaved.email);
    next();  // Tell that here works completed now jump/go to next middleware
})


// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    // Salt - String of char's(auto generated random) other than our password, make our password more secure 
    // e.g saltPassword + hashingAlgo = encrypted form password
    const salt = await bcrypt.genSalt();

    // this is pointing out to User ka instance i.e data, we created at line 43(auth Controller)
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }
        throw Error('Incorrect Password')
    }
    throw Error("Incorrect Email");
}

const User = new mongoose.model("user", userSchema);

module.exports = User;