
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const GridFile = require('./gridfile.model')
const path = require('path')
const fs = require('fs')

// @route POST /upload
// @desc  Uploads file to DB
// upload a file
app.post('/v1/files', upload.any(), async (req, res, nxt) => {
  try {
    // uploaded file are accessible as req.files
    if (req.files) {
      const promises = req.files.map(async (file) => {
        const fileStream = fs.createReadStream(file.path)

        // upload file to gridfs
        const gridFile = new GridFile({ filename: file.originalname })
        await gridFile.upload(fileStream)

        // delete the file from local folder
        fs.unlinkSync(file.path)
      })

      await Promise.all(promises)
    }

    res.sendStatus(201)
  } catch (err) {
    nxt(err)
  }
})

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/api/document/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/');
    });
  });


  // @route GET /files/:filename
// @desc  Display single file object
app.get('/api/document/:documentname', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
          return res.status(404).json({
              err: 'No file exists'
          });
      }
      // File exists
      return res.json(file);
  });
});
