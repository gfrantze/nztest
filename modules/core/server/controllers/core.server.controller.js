'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  fs = require('fs'),
  multer = require('multer');


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};


//handles core image upload functionality, API endpoint
exports.uploads = function (req, res) {

  var file=req.files.uploadedFile;
  var user = req.user;
  var message = null;

  //the target folder is ./modules/core/client/img/uploads/base64(username)/
  var userEncode = new Buffer(user.username).toString('base64');
  var destFolder = path.join(path.resolve('./'),config.uploads.fileUpload.dest,userEncode);
  var newFilename = Date.now()+"-"+file.originalFilename;
  var destFile = destFolder+"/"+newFilename;

  //var destURL = req.protocol + '://' + req.get('host') + config.uploads.fileUpload.dest+userEncode+"/"+Date.now()+".jpg";
  var destURL = config.uploads.fileUpload.dest+userEncode+"/"+newFilename;

  //config multer, somehow the diskStorage() is not working
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destFolder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now());
    }
  });

  var upload = multer({ storage : storage}).single('uploadedFile');
  // Filtering to upload only images
  upload.fileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;

  // upload file
  upload(req,res,function (err) {
    if(err) {
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    }else{
      // For some reason, the diskStorage function of Multer doesn't work.
      // The following code is to move the file to the destination folder.
      var stat =null;
      try {
        stat = fs.statSync(destFolder);
      } catch (err) {
        fs.mkdirSync(destFolder);
      }
      if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + destFolder + '"');
      } else {
        fs.rename(file.path, destFile, function(err) {
          if (err) throw err;
          // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
          fs.unlink(file.path, function() {
            if (err) {
                throw err;
            }else{
              return res.status(200).send({
                uploadedURL: destURL,
                uploadedFile: destFile,
                file: JSON.stringify(req.files),
                message: 'File is uploaded to ' + destURL
              });
            }
          });
        });
      }
    }
  });
};
