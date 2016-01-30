var express = require('express');
var router = express.Router();

var indexCtrl = require('../controllers/index.ctrl');

router.get('/', indexCtrl.getIndex);

module.exports = router;
