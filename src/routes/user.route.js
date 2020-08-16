'use strict'
const express = require('express');
var userController = require('../controllers/user.controller');
const router = express.Router();
const verify = require('../helper/verifyToken');
const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, file.filename + '.' + file.originalname.split('.')[1]);
//     }
// });

var upload = multer({ dest: './uploads' });

router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verify, userController.getAllUsers);
router.get('/users/:id', verify, userController.getUserById);
router.delete('/users/:id', verify, userController.deleteUser);
router.put('/users/:id', verify, userController.updateUser);
router.post('/image/:id', verify, upload.single('img'), userController.uploadImage);
router.get('/image/:image', verify, userController.getImageFile);

module.exports = router;