var express = require('express');
var router = express.Router();

var DBManager = require('../database/DBManager.js');
var conn = DBManager.getConnection();


var sql = 'select is_noti from app_settings where id = ?';
var save_sql = 'update app_settings set is_noti = ? where id = ?';

/* GET users listing. */
router.get('/', function(req, res, next) {
		//json 읽어오기
		//변수에 따라 check 결정
    var current_id = ['1'];
    var isCheckedAlert = '';
    conn.query(sql, current_id, function(err, rows, fields) {
        if(err) {
            console.log(err);
        } else{
            console.log(rows);
            console.log(fields);
            if(rows[0].is_noti == 1) {
                isCheckedAlert = 'checked';
            }
            res.render('setting', {checked_alert: isCheckedAlert});
        }
    });
});

router.post('/save', function (req,res,next) {
    var is_noti = req.body.noti_switch;
    var tmp;
    if(is_noti == undefined) {
        tmp='0';
    } else {
        tmp='1';
    }
    var current_id_and_isnoti = [tmp, '1'];
    conn.query(save_sql, current_id_and_isnoti, function (err, rows, fields) {
        if(err) {
            console.log(err);
        } else{
            console.log('저장되었습니다.');
        }
    });
});

module.exports = router;

