var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('createFile.ejs');
});
router.get('/compress', function(req, res) {
  res.render('compressFile.ejs');
});



module.exports = router;
