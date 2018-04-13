const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload' });
});

module.exports = router;
