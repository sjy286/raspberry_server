var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('video_call_log');
});

module.exports = router;
