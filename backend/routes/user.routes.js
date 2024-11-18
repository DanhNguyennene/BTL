const express = require('express');
const router = express.Router();

const {
    signUp,
    signIn,
    getUserInfo
} = require('../controllers/book.controllers');
const { verify } = require('jsonwebtoken');

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/:username', getUserInfo);
module.exports = router;    