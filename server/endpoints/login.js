const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// Load User model
const User = require("../models/User");

// Load input validation
const validateLoginInput = require("../functionality/validatelogin");
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

function login(req, res) {
    // Form validation

    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json({ success: false, message: errors.message });
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by username
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, error: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user._id,
                    email: user.email
                };

                // Sign token
                jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 30*24*60*60 // 1 month in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            accessToken: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ success: false, error: "Password is incorrect." });
            }
        });
    });
};

module.exports = login