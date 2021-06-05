const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const documentSchema = new Schema({
    createdAt: String,
    isLocked: {
        type: Object,
        required: true,
        default: {
            mode: false,
            lockedBy: null,
            lockCode: null
        }
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
    // initialFileId is enforced to be unique
    initialFileId: {
        type: Schema.Types.ObjectId,
        ref: 'uplaods.files',
        required: true
    },
    lastVersionId: {
        type: Schema.Types.ObjectId,
        ref: 'uplaods.files',
        required: true
    },
    versions: [
        {
            type: Object,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = Document = mongoose.model("documents", documentSchema);