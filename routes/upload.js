var express = require('express');
var router = express.Router();
//이 라우터는 업로드 테스트용이므로 나중에 삭제 요망
const multer = require('multer');

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('uploadForm');
});

router.post('/', upload.single('userfile'), function(req, res, next) {
    console.log(req.file);
    res.send('UPload : '+ req.file.filename);
});

module.exports = router;
