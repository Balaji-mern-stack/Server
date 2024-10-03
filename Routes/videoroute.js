const { Router } = require('express');
const { uploadVideo, getAllVideos, getVideosByUploader } = require('../Controllers/videocontroller'); // Make sure this path is correct

const router = Router();

// Ensure the callback functions exist
router.post('/upload', uploadVideo); 
router.get('/getall', getAllVideos);
router.get('/get/:uploadedBy', getVideosByUploader);

module.exports = router;
