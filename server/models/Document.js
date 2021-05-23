const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const documentSchema = new Schema({
    createdAt: String,
    isLocked: {
        type: Boolean,
        required: true,
        default: false
    },
    userEmail: {
        type: String,
        required: true
    },
    // documentName is enforced to be unique
    documentName: {
        type: String,
        required: true
    },
    documentDescription: {
        type: String,
        required: true
    },
    // documentId is enforced to be unique
    documentId: {
        type: Schema.Types.ObjectId,
        ref: 'uplaods.files',
        required: true
    },
    versions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'uploads.files'
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = Document = mongoose.model("documents", documentSchema);