const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: String,
    isPremium: {
        type: Boolean,
        required: true,
        default: false
    },
    documents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'documents'
        }
    ]
});

module.exports = User = mongoose.model("users", userSchema);