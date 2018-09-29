var express = require('express');
var router = express.Router();

var multer = require('multer');

var voice_mail_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype.split('/')[0] == 'audio') {
            cb(null, 'upload/absence_voice_mail/');
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

var upload = multer({ storage: voice_mail_storage}).single('absence_voice_mail');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('settings');
});

//settings/absence_voice_mail_save
router.post('/absence_voice_mail_save', function(req, res, next) {
    upload(req, res, function (err) {
        console.log(req.body);
        console.log(req.file);
        if(err || !req.file) {
            return res.json({ msg : "저장실패"});
        }
        //res.send('<script type="text/javascript">alert("저장완료");document.location.href="/settings";</script>');   //일단 같은파일명으로 덮어쓰기함 파일 요청시에는 /absence_voice_mail/파일명 으로 접근
    });
});

module.exports = router;

