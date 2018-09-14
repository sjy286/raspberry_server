var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('voice_mail_log');
});

module.exports = router;
