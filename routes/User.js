const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../Utils/WrapAsync');
const passport = require('passport');
const joi = require('joi');
const users = require('../Controllers/user')
const Checkauthentication = require('../middleware');
router.get('/register', catchAsync(users.REnderREgister))
router.post('/register', catchAsync(users.PostingReviews));
router.get('/login',users.RenderLogin)
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.PostingLogin)
router.get('/logout', users.Logginout);
module.exports= router;