const { Router } = require('express');
const router = Router();
const { create, getAll, getById, update, remove, imageUploadByPhone, updateSkills, login, updatePassword, updatePhoneNumber, getUserByPhoneNumber,getUserSkill} = require('../Controllers/usercontrollers');

router.post('/create', create);
router.get('/getall', getAll);
router.get('/getbyid/:id', getById);
router.post('/update/:id', update);
router.post('/delete/:id', remove);
router.post('/imageupload/:phonenumber', imageUploadByPhone);
router.post('/updateskills/:phonenumber', updateSkills);
router.post('/login', login);
router.post('/updatepassword', updatePassword);
router.post('/updatephonenumber/:id', updatePhoneNumber);
router.get('/getbyphonenumber/:phonenumber', getUserByPhoneNumber);
router.get('/getskill/:phonenumber',getUserSkill );








module.exports = router;
