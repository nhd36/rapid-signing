const Document = require('../models/Document')
const User = require('../models/User')


/** 
 * POST
 * /create-document
 * body: userEmail, documentName, documentDescription
 */
async function createDocument(req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    if (!req.body.hasOwnProperty("userEmail") ||
        !req.body.hasOwnProperty("documentName") ||
        !req.body.hasOwnProperty("documentDescription")) {
        return res.status(404).json({ success: false, message: "user email, name or description, or document is missing." })
    }

    const userEmail = req.body.userEmail
    const documentName = req.body.documentName
    const documentDescription = req.body.documentDescription
    // Check if the userEmail is empty 
    if (userEmail.trim() === '') {
        res.status(404).json({ success: false, message: 'userEmail must not be empty' });
        return
    }
    // Check if the documentName is empty 
    if (documentName.trim() === '') {
        res.status(404).json({ success: false, message: 'documentName must not be empty' });
        return
    }
    // Check if the documentDescription is empty 
    if (documentDescription.trim() === '') {
        res.status(404).json({ success: false, message: 'documentDescription must not be empty' });
        return
    }
    // Check if the documentId is empty 
    if (req.file.id === '') {
        res.status(404).json({ success: false, message: 'initialFileId must not be empty' });
        return
    }

    try {
        // Check if there is an existing user.
        const user = await User.findOne({ email: userEmail })
        if (!user) return res.status(404).json({ success: false, error: "Email is invalid" });

        // Check if user already has created document with same name.
        const document = await Document.find({ documentName: documentName })
        if (document.length > 0) {
            return res.status(404).json({ success: false, error: 'User already has a document with same name\n Please create a document with unique name' });
        } else {
            // User doesn't have another document with the same name
            // Save the document entry.
            const newDocument = new Document({
                userEmail: userEmail,
                documentName: documentName,
                documentDescription: documentDescription,
                initialFileId: req.file.id,
                createdAt: new Date().toISOString(),
                user: user._id,
                lastVersionId: req.file.id
            })
            await newDocument.save();
            user.documents.push(newDocument._id)
            await user.save()
            res.status(200).json({ success: true, id: newDocument._id, message: "Document is created successfully." })
            return
        }
    } catch (err) {
        res.status(404).json({ success: false, message: 'Your Document is not valid/cannot be saved. A technical error occurred. Please try again later.' })
        console.log("Error occurred during document creation", err)
        return
    }

}

/** 
 * GET
 * /document/:id 
 * 
 */
async function getDocument(req, res) {
    try {
        const document = await Document.findById({ _id: req.params.id });
        if (!document) return res.status(404).send({ success: false, message: "document doesn't exist. " });
        return res.status(200).send({ success: true, document: document });
    } catch (err) {
        res.status(404).json({ success: false, error: 'Your Document is not fetched. A technical error occurred. Please try again later.' })
        return
    }
}

/** 
 * GET
 * /documents
 * get documents that belong to a user. Also aggregate the individual versions.
 */
async function getAllDocuments(req, res) {
    // Check if there is an existing user.
    const user = await User.findOne({ email: req.user.email })
    if (!user) return res.status(404).json({ success: false, error: "Email is invalid" });
    const documents = user.documents;
    let result = [];
    for (let i = 0; i < documents.length; i++) {
        let document = await Document.find({ _id: documents[i]._id, user: req.user._id });
        result.push(...document); //spread to have a list of objects not list of list of objects.
    }
    return res.status(200).json({ success: true, documents: result });
}

/** 
 * DELETE
 * /delete-document/:id 
 * **IMPORTANT**: idempotent endpoint . Will return 200 if the document doesn't exist.
 */
async function deleteDocument(req, res) {
    try {
        await Document.findOneAndRemove({ _id: req.params.id });
        const document = await Document.findById({ _id: req.params.id });
        if (!document) return res.status(200).send({ success: true, message: "Document is deleted" });
        return res.status(404).send({ success: false, message: "Document still exist. " + req.params.id });
    } catch (err) {
        res.status(404).json({ success: false, error: 'Your Document is not deleted. A technical error occurred. Please try again later.' })
        return
    }

}

/** 
 * POST
 * /lock-document/:id
 */
async function lockDocument(req, res) {
    const updatedDocument = await Document.findOneAndUpdate({ _id: req.params.id }, { isLocked: true }, { new: true })
    if (!updatedDocument) {
        return res.status(404).json({ success: false, error: "Document doesn't exist" });
    } else {
        return res.status(200).json({ success: true, id: updatedDocument._id, message: "Document is locked successfully." })
    }
}

/** 
 * POST
 * /unlock-document/:id
 */
async function unlockDocument(req, res) {
    const updatedDocument = await Document.findOneAndUpdate({ _id: req.params.id }, { isLocked: false }, { new: true })
    if (!updatedDocument) {
        return res.status(404).json({ success: false, error: "Document doesn't exist" });
    } else {
        return res.status(200).json({ success: true, id: updatedDocument._id, message: "Document is unlocked successfully." })
    }
}


module.exports = { getDocument, getAllDocuments, createDocument, deleteDocument, lockDocument, unlockDocument }