var express = require('express');
var router = express.Router();

var DBManager = require('../database/DBManager.js');
var conn = DBManager.getConnection();

var search_voice_mail_sql = 'select log.log_no, current_datetime, memo, file from log, writes where log.log_no = writes.log_no and function_type = \'picture\';';

router.get('/', function(req, res, next) {
    conn.query(search_voice_mail_sql, function(err, rows, fields) {
        if(err) {
            console.log(err);
        }  else {
            console.log(rows);
            res.render('video_call_log', {
                row : rows,
                length : rows.length
            });
        }
    });
});

module.exports = router;
