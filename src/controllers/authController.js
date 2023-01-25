const User = require("../models/User");

// JSON Web Token
const jwt = require('jsonwebtoken');

// Handel Errors
const handelErrors = (err) => {

    let errors = {
        email: '',
        password: ''
    }

    /* Login */
    // Incorrect Email
    if (err.message === 'Incorrect Email') {
        errors.email = 'that email is not registered';
    }

    // Incorrect Email
    if (err.message === 'Incorrect Password') {
        errors.password = 'password is incorrect';
    }

    /* Singup */
    // Duplicate Email Error Code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        // Email Correct/Incorrect
        if (err.errors.email) {
            errors.email = err.errors.email.properties.message;
        }

        // Password Correct/Incorrect
        if (err.errors.password) {
            errors.password = err.errors.password.properties.message;
        }
    }
    return errors;

}

// Create Token  
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret', {
        expiresIn: maxAge    // expect time in seconds, where as cookies expect time in milli seconds
    });
}


module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = new User({
            email: email,
            password: password
        })

        const user = await data.save();
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handelErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
            user: user._id
        })

    } catch (err) {
        const errors = handelErrors(err);
        res.status(400).json({ errors });
    }
}

// Logout
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}