const bcrypt = require("bcryptjs");

// Load input validation
const validateRegisterInput = require("../functionality/validateregister");


// Load User model
const User = require("../models/User");

// @route get /register
// @desc Register user
// @access Public
function register(req, res) {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json({success: false, message: errors.message });
    }
    let userInputEmail = req.body.email;
    let userInputPassword = req.body.password;
    User.findOne({ email: userInputEmail }).then(user => {
        if (user) {
            return res.status(400).json({ success: false, message: "Email already taken." });
        } else {
            const newUser = new User({
                email: userInputEmail,
                password: userInputPassword
            });

            // Hash password before saving in database
            // Donot store the plaintext password.
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({ user: user, success: true }))
                        .catch(err => console.log(err));
                });
            });
        }
    }).catch(error => console.log(error));
};

module.exports = register