const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'image' ? 'Images' : 'Certificates';
        cb(null, path.join(__dirname, 'Controllers', 'Data', folder));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
