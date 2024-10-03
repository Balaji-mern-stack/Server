const express = require('express');
const router = express.Router();
const { create, getAll, getOne, update, deleteone,login,Status} = require('../Controllers/admincontrollers');


router.post('/create',create);
router.get('/getall', getAll);
router.get('/getone/:id',getOne);
router.post('/update/:id',update);
router.delete('/delete/:id',deleteone);
router.post('/login',login);
router.post('/status',Status); 

module.exports = router;
