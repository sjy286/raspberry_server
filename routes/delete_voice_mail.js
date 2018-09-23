var express = require('express');
var router = express.Router();

var DBManager = require('../database/DBManager.js');
var conn = DBManager.getConnection();

var delete_voice_mail_sql = 'select log.log_no, current_datetime, memo, file from log, writes where log.log_no = writes.log_no;';

router.post('/', function(req, res, next) {
    console.log(req.body.voice_mail_log);
    conn.query(delete_voice_mail_sql, function(err, rows, fields) {
        if(err) {
            console.log(err);
        }  else {
            console.log(rows);
            res.render('voice_mail_log', {
                row : rows,
                length : rows.length
            });
        }
    });
});

module.exports = router;
