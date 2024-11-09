

const express = require('express');
const router = express.Router();

const {
    signUp,
    signIn
} = require('../controllers/book.controllers');
const { verify } = require('jsonwebtoken');




router.post('/signin', signIn);
router.post('/signup', signUp);





module.exports = router;    