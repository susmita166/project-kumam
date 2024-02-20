const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
         console.log(req.files);
        cb(null, 'public/uploads/jobs_docs/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

module.exports = upload;
