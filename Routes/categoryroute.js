const { Router } = require('express');
const router = Router();

const { create, getAll, getOne, update, deleteone} = require('../Controllers/categorycontrollers');

router.post('/submit', create);
router.get('/all', getAll);
router.get('/getone/:id', getOne);
router.post('/update/:id', update);
router.delete('/delete/:id', deleteone);

module.exports = router;
