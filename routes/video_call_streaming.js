var express = require('express');
var router = express.Router();

var url = 'rtsp://192.168.0.22:8554/test'
//var stream = new rtsp.FFMpeg({input: uri});
/*
io.on('connection', function(socket) {
    var pipeStream = function(data) {
        socket.emit('data', data.toString('base64'));
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function() {
        stream.removeListener('data', pipeStream);
    });
});
*/
router.get('/', function(req, res, next) {
  /*  var cmd = 'gst-launch-1.0';
   // var args = ['-v', 'tcpclientsrc', 'host=192.168.0.22', 'port=5000', '!',
       // 'gdpdepay', '!', 'rtph264depay', '!', 'avdec_h264', '!', 'videoconvert', '!', 'autovideosink',
       // 'sync=false'];
    var args = ['autovideosrc', 'horizontal-speed=1', 'is-live=true',
        '!', 'videoconvert',
        '!', 'vp8enc', 'cpu-used=5', 'deadline=1', 'keyframe-max-dist=10',
        '!', 'queue', 'leaky=1',
        '!', 'm.', 'webmmux', 'name=m', 'streamable=true',
        '!', 'queue', 'leaky=1',
        '!', 'tcpserversink', 'host=192.168.0.22', 'port=5000', 'sync-method=2'];
    var child = require('child_process');
    var gstreamer = child.spawn(cmd, args, {stdio: 'ignore'});

    gstreamer.on('exit', function (code) {
        if (code != null) {
            console.log('GStreamer error, exit code ' + code);
        }
        process.exit();
    });

    // res.render('video_call_str;eaming')
    var date = new Date();

    res.writeHead(200, {
        'Date': date.toUTCString(),
        'Connection': 'close',
        'Cache-Control': 'private',
        'Content-Type': 'video/webm',
        'Server': 'CustomStreamer/0.0.1',
    });

    var net = require('net');
    var socket = net.connect(5000, function () {
        socket.on('close', function (had_error) {
            res.end();
        });
        socket.on('data', function (data) {
            res.write(data);
        });
    });
    socket.on('error', function (error) {
        console.log(error);
    });
    */

});

module.exports = router;
