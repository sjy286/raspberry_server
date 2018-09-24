var express = require('express');
var router = express.Router();

var DBManager = require('../database/DBManager.js');
var conn = DBManager.getConnection();

var search_voice_mail_file_name = 'select file from writes where log_no = ?';
var delete_voice_mail_sql_1 = 'delete from log where log_no = ?;';
var delete_voice_mail_sql_2 = 'delete from writes where log_no = ?;';
//delete from log where log_no = ?
//delete from writes where log_no = ?
var fs = require('fs');

function delete_voice_mail(param) {
    conn.query(search_voice_mail_file_name, param, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            var file_name = rows[0].file.split('/');
            //파일도 삭제해야 됨
            fs.unlink('./upload/voice_mail/' + file_name[2], err => {
                if (err) 
                    return console.log(err);
                }
                console.log('file is deleted');
            });
        }
    });
    conn.query(delete_voice_mail_sql_1, param, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('log테이블에서 삭제 완료');
        }
    });
    conn.query(delete_voice_mail_sql_2, param, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('writes테이블에서 삭제 완료');
        }
    });
};

router.post('/', function (req, res, next) {
    console.log(req.body.voice_mail_log);
    //파일 하나 삭제 또는 그냥 삭제눌렀을 때 예외처리 해야 됨
    console.log(Array.isArray(req.body.voice_mail_log));
    if (!Array.isArray(req.body.voice_mail_log)) {
        var param = req.body.voice_mail_log;
        delete_voice_mail(param);
    } else {
        for (var i = 0; i < req.body.voice_mail_log.length; i++) {
            var param = req.body.voice_mail_log[i];
            delete_voice_mail(param);
        }
    }
    res.redirect('/voice_mail_log');  //log페이지 갱신
});
module.exports = router;