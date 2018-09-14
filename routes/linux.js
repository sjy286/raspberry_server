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

module.exports = router;
