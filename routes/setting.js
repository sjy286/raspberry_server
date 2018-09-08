var express = require('express');
var router = express.Router();
var DBManager = require('../database/DBManager.js');
var conn = DBManager.getConnection();

var sql = 'select is_noti from app_settings where id = ?';

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
            console.log(rows[0].is_noti);
            if(rows[0].is_noti == 1) {
                isCheckedAlert = 'checked';
            }
            res.render('setting', {checked_alert: isCheckedAlert});
        }
    });
});

module.exports = router;

