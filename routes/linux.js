module.exports = function (current_video_call_state) {
    var express = require('express');
    var router = express.Router();

    var DBManager = require('../database/DBManager.js');
    var conn = DBManager.getConnection();
    var voice_mail_save_sql ='insert into log (current_datetime, memo) values(?, ?);';
    var voice_mail_save_sql2 = 'insert into writes (device_id, log_no, file, function_type) values(\'deviceID\',?,?,\'audio\');';
    var datetime = new Date();

    var FCM = require('fcm-node');
    var serverKey = require('../config/FCMserverkey');
    var fcm = new FCM(serverKey.serverkey);
    var client_token = 'eB6NEGJMpJw:APA91bHKcYppGbtT9teUKwe-lufqcG5o-GfF-7WsIdS1bcRPmgyp3b3b3JYfcieyHiVRpGPddBjRMuouw7QfdFbv2fsFjJOFfvtQkbeBQGJkMiWJkx6746SQWQ_zWHJmVsGOtPdcaCAJ';
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
            title: "Hello Node 운영체제에서 처리하는 부분",
            body: "Node로 발송하는 Push 메시지 입니다. - 실행중이 아닐 때",
            sound: "default",
            click_action: "FCM_PLUGIN_ACTIVITY",
            icon: "ic_launcher"
        },
        // 메시지 중요도
        priority: "high",
        // App 패키지 이름
        restricted_package_name: "com.example.word.raspberrytest",
        // App에게 전달할 데이터
        data: {
            num1: '실행중일 때 나타나는 알림',
            num2: '보내고 싶은 데이터 값을 넣는다'
        }
    };

    var multer = require('multer');

    var voice_mail_storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.mimetype.split('/')[0] == 'audio') {
                cb(null, 'upload/voice_mail/');
            } else if(file.mimetype.split('/')[0] == 'image') {
                cb(null, 'upload/guest_picture/');
            } else {
                cb(null, 'upload/');
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    var upload = multer({ storage: voice_mail_storage});

//linux/video_call_request - Android App에서 통화 거절 0 통화 승인 1로 response
    router.get('/video_call_request', function(req, res, next) {
        //영상통화가 있음을 Android App에 알림 - 푸시 -- 소켓써야 될듯 socket.io - 양방향 통신 구현

        res.json({ msg:"Android App이 socket listen 하지 않음", return:-1});
    });

//linux/voice_mail_save
    router.post('/voice_mail_save', upload.single('voice_mail'), function(req, res, next) {   //후에 post로 고쳐서 확인 - 음성파일 받아야 되기 때문에
        //받은 음성파일과 함께 현재시각 DB에 저장
        var params = [ datetime, 'Example Memo' ]
        conn.query(voice_mail_save_sql, params, function(err, rows, fields) {
            if(err) {
                console.log(err);
            }  else {
                console.log(rows);
            }
        });

        var current_insert_log_no = 0;
        conn.query('select max(log_no) as max_log_no from log', function(err, rows, fields) {
            if(err) {
                console.log(err);
            }  else {
                console.log(rows);
                current_insert_log_no = rows[0].max_log_no;
                var params2 = [ current_insert_log_no ,'/voice_mail_upload/'+ req.file.originalname];
                conn.query(voice_mail_save_sql2, params2, function(err, rows, fields) {
                    if(err) {
                        console.log(err);
                    }  else {
                        console.log(rows);
                    }
                });

            }
        });

        console.log('저장완료 : ' + req.file.originalname);
        res.send('저장완료 : ' + req.file.originalname);

        //후에 웹브라우저와 안드로이드에게 푸시메시지 발송
        fcm.send(push_data, function(err, response) {
            if (err) {
                console.error('Push메시지 발송에 실패했습니다.');
                console.error(err);
                return;
            }

            console.log('Push메시지가 발송되었습니다.');
            console.log(response);
        });
    });

//linux/video_call_start
    router.post('/video_call_start' , function (req, res, next) {
        //영상통화 시작 했다는 걸 linux 프로그램이 알림 - 결론 : 리눅스프로그램이 영상통화를 웹페이지에 뿌린후 이 url을 요청
        //socket.io를 통해 Android App에 알림 - 후에 Android App은 내 웹페이지에 있는거 가져가면 됨
		current_video_call_state = 1;
    });

//linux/video_call_exit
    router.post('/video_call_exit', function (req, res, next) {
        //리눅스 프로그램에서 먼저 영상통화를 끊을때 이 url을 요청
		if(current_video_call_state == 0) {
			//잘못된 요청 또는 이미 끊어졌습니다.
		} else {
            //socket.io를 통해 Android App에 알림 - 후에 Android App은 영상통화 종료
			current_video_call_state = 0;
		}
    });

    return router;
}

