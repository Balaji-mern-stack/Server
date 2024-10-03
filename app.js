const { Router } = require('express');

const router = Router();

// Use routes properly
router.use('/category', require('./Routes/categoryroute'));
router.use('/admin', require('./Routes/adminroute'));
router.use('/users', require('./Routes/userroutes'));
router.use('/mobileauth',require('./Controllers/otpverification')); 
router.use('/videos', require('./Routes/videoroute')); 

module.exports = router;
