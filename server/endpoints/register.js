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
        return res.status(400).json(errors);
    }

    User.findOne({$or:[{email: req.body.email},{username: req.body.username}]}).then(user => {
        if (user) {
            if (user.email === req.body.email){
                return res.status(400).json({ success:false, error: "Email already exists." });
            } 
            else if (user.username === req.body.username){
                return res.status(400).json({ success:false, error: "Username already exists." });
            }
            return res.status(400).json({ success:false, error: "Username or email already taken." });
        } else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({user:user, success: true}))
                        .catch(err => console.log(err));
                });
            });
        }
    });
};

module.exports = register