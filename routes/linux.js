module.exports = function (current_video_call_state) {
    var express = require('express');
    var router = express.Router();
    var app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

//linux/video_call_request - Android App에서 통화 거절 0 통화 승인 1로 response
    router.get('/video_call_request', function(req, res, next) {
        //영상통화가 있음을 Android App에 알림 - 푸시 -- 소켓써야 될듯 socket.io - 양방향 통신 구현
        io.on('connection', (socket) => {
            console.log('Android App과 연결되었습니다.');
            io.to(socket.id).emit('video call request event', {msg:"video_call_request"}); //연결된 특정 클라이언트에만 전송

            socket.on('disconnect', function() {
                console.log('Android App과 연결이 끊어졌습니다.');
            });

            socket.on('receive message', function(result) {
                //결과 받아서

                if(result == 0) {
                    res.json({ msg:"통화가 거절되었습니다.", return:0});
                } else {
                    res.json({ msg:"통화가 승인되었습니다.", return:1});
                }

            });
        });
        res.json({ msg:"Android App이 socket listen 하지 않음", return:-1});
    });

//linux/voice_mail_save
    router.post('/voice_mail_save', function(req, res, next) {
        //받은 음성파일과 함께 현재시각 DB에 저장
        //후에 웹브라우저와 안드로이드에게 푸시메시지 발송
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

