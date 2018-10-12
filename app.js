var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var current_video_call_state = 0;

var indexRouter = require('./routes/index');		//메인페이지
var settingsRouter = require('./routes/settings');		//각종 setting
var blankRouter = require('./routes/blank');	//템플릿 페이지 
var errorRouter = require('./routes/error');		//에러 페이지
var voiceMailLogRouter = require('./routes/voice_mail_log');		//음성메시지 기록 페이지
var voiceMailDelRouter = require('./routes/delete_voice_mail');     //음성메시지 기록 삭제 처리
var videoCallLogRouter = require('./routes/video_call_log');		//영상통화 기록 페이지
var videoCallDelRouter = require('./routes/delete_video_call');
var mobileRouter = require('./routes/mobile')(current_video_call_state);  //모바일 전용 라우터
var linuxRouter = require('./routes/linux')(current_video_call_state); //리눅스 프로그램 전용 라우터
var videoCallStreamingRouter = require('./routes/video_call_streaming'); //스트리밍 페이지
var uploadRouter = require('./routes/upload');

var app = express();
var bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/settings', settingsRouter);
app.use('/blank', blankRouter);
app.use('/error', errorRouter);
app.use('/voice_mail_log', voiceMailLogRouter);
app.use('/delete_voice_mail',voiceMailDelRouter);
app.use('/delete_video_call',videoCallDelRouter);
app.use('/video_call_log', videoCallLogRouter);
app.use('/mobile', mobileRouter);
app.use('/linux', linuxRouter);
app.use('/video_call_streaming', videoCallStreamingRouter);
app.use('/upload', uploadRouter);

app.use('/voice_mail_upload', express.static('upload/voice_mail'));
app.use('/absence_voice_mail', express.static('upload/absence_voice_mail')); //부재시 음성메시지 출력파일
app.use('/guest_picture', express.static('upload/guest_picture'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
