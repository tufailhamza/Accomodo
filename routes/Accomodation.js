const express = require('express');

const router = express.Router();
const catchAsync = require('../Utils/WrapAsync');
const Checkauthentication = require('../middleware')
const validateAccomodation = require('../middleware')
const isAuthor = require('../middleware')
const AccomoController = require('../Controllers/Accomodation')
const multer  = require('multer')
const {storage} = require('../Cloudinary/index');

const upload = multer({storage})
router.route('/')
      .get(catchAsync(AccomoController.index))
      .post(Checkauthentication,upload.array('image'),validateAccomodation,catchAsync(AccomoController.CreateAccomodation));
router.get('/new',Checkauthentication,catchAsync(AccomoController.newAccomodation));
router.route('/:id').get(catchAsync(AccomoController.RenderingAcomodation))
                    .put(Checkauthentication,isAuthor,upload.array('image'),validateAccomodation,catchAsync(AccomoController.Updation))
                    .delete(Checkauthentication,isAuthor,catchAsync(AccomoController.destroyACcomodation) )
router.get('/:id/edit',Checkauthentication,isAuthor,catchAsync(AccomoController.EditAccomodation));
module.exports=router;

