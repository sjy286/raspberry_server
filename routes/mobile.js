﻿module.exports = function (current_video_call_state) {    var express = require('express');    var router = express.Router();    var DBManager = require('../database/DBManager.js');    var conn = DBManager.getConnection();    var search_voice_mail_sql = 'select log.log_no, current_datetime, memo, file from log, writes where log.log_no = writes.log_no and function_type = \'audio\';';    var search_video_call_sql = 'select log.log_no, current_datetime, memo, file from log, writes where log.log_no = writes.log_no and function_type = \'picture\';';    var search_voice_mail_file_name = 'select file from writes where log_no = ?';    var delete_voice_mail_sql_1 = 'delete from log where log_no = ?;';    var delete_voice_mail_sql_2 = 'delete from writes where log_no = ?;';    var fs = require('fs');    function delete_voice_mail(param) {        conn.query(search_voice_mail_file_name, param, function (err, rows, fields) {            if (err) {                console.log(err);            } else {                console.log(rows);                var file_name = rows[0].file.split('/');                //파일도 삭제해야 됨                fs.unlink('./upload/voice_mail/' + file_name[2], err => {                    if (err) {                        return console.log(err);                    }                    console.log('file is deleted');                });            }        });        conn.query(delete_voice_mail_sql_1, param, function (err, rows, fields) {            if (err) {                console.log(err);            } else {                console.log('log테이블에서 삭제 완료');            }        });        conn.query(delete_voice_mail_sql_2, param, function (err, rows, fields) {            if (err) {                console.log(err);            } else {                console.log('writes테이블에서 삭제 완료');            }        });    };    var multer = require('multer');    var voice_mail_storage = multer.diskStorage({        destination: function (req, file, cb) {            if(file.mimetype.split('/')[0] == 'audio') {                cb(null, 'upload/absence_voice_mail/');            } else if(file.mimetype.split('/')[0] == 'image') {                cb(null, 'upload/guest_picture/');            } else {                cb(null, 'upload/');            }        },        filename: function (req, file, cb) {            cb(null, file.originalname);        }    });    var upload = multer({ storage: voice_mail_storage}).single('absence_voice_mail');//mobile/voice_mail_log    router.get('/voice_mail_log', function(req, res, next) {        conn.query(search_voice_mail_sql, function(err, rows, fields) {            if(err) {                console.log(err);            }  else {                console.log(rows);                res.json(rows);            }        });    });//mobile/video_call_log    router.get('/video_call_log', function(req, res, next) {        conn.query(search_video_call_sql, function(err, rows, fields) {            if(err) {                console.log(err);            }  else {                console.log(rows);                res.json(rows);            }        });    });//mobile/absence_voice_mail_save    router.post('/absence_voice_mail_save', function(req, res, next) { //일단 같은파일명으로 덮어쓰기함 파일 요청시에는 /absence_voice_mail/파일명 으로 접근        upload(req, res, function (err) {            if(err || !req.file) {                return res.json({ msg : "저장실패"});            }            res.json({ msg : "저장성공"});        });    });//mobile/save_memo/:log_id/:memo    router.get('/save_memo/:log_id/:memo', function(req, res, next) {        //특정 log_id에 대한 memo 저장 - 이미 저장 되있다면 덮어쓰기    });//mobile/voice_mail_log/delete - post 방식으로 삭제할 log_no json 배열을 보내준다.    router.post('/voice_mail_log/delete', function(req, res, next) {        console.log(req.body.voice_mail_log);        //파일 하나 삭제 또는 그냥 삭제눌렀을 때 예외처리 해야 됨        console.log(Array.isArray(req.body.voice_mail_log));        if (!Array.isArray(req.body.voice_mail_log)) {            //var param = req.body.voice_mail_log;            delete_voice_mail(param);        } else {            for (var i = 0; i < req.body.voice_mail_log.length; i++) {                //var param = req.body.voice_mail_log[i];                delete_voice_mail(param);            }        }    });//mobile/video_call_log/delete - post 방식으로 삭제할 log_no json 배열을 보내준다.    router.post('/video_call_log/delete', function(req, res, next) {        //log_no에 해당하는 삭제 쿼리 반복수행        console.log(req.body.video_call_log);        //파일 하나 삭제 또는 그냥 삭제눌렀을 때 예외처리 해야 됨        console.log(Array.isArray(req.body.video_call_log));        if (!Array.isArray(req.body.video_call_log)) {            //var param = req.body.voice_mail_log;            delete_voice_mail(param);        } else {            for (var i = 0; i < req.body.video_call_log.length; i++) {                //var param = req.body.voice_mail_log[i];                delete_voice_mail(param);            }        }    });//mobile/video_call_exit    router.get('/video_call_exit', function(req, res, next) {        //모바일프로그램에서 먼저 끊을 때 이 url 요청        if(current_video_call_state == 0) {            //잘못된 요청 또는 이미 끊어졌습니다.        } else {            //socket.io를 통해 리눅스프로그램에 알림            current_video_call_state = 0;        }    });//mobile/register_token    router.post('/register_token', function(req, res, next) {        console.log(res.body);    });    return router;}