const joi = require('joi')
module.exports.accomoSchema=  joi.object({
    Accomodation : joi.object({
        title: joi.string().required(),
        price:joi.number().min(0).required(),
        // image: joi.string().required(),
        location: joi.string().required(),
        description : joi.string().required()
      }).required()
  })
  module.exports.reviewSchema = joi.object({
    review : joi.object({
        body : joi.string().required(),
        rating: joi.number().required()
        
    }).required()
  })