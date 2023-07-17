const mongoose = require('mongoose');
const schema= mongoose.Schema;
const Review = require('./review')
//https://res.cloudinary.com/dzhkmbnbn/image/upload/w_300/v1689345267/Accomodo/ksomm30zcewif4zihia4.jpg
const ImageSchema = new schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload','/upload/w_200')
})
ImageSchema.virtual('thumbnail1000').get(function () {
  return this.url.replace('/upload','/upload/w_1000')
})
const opts = {toJSON : {virtuals : true}};
const AcomodoSchema= new schema({
    title: String,
    images :[ImageSchema],
    geometry: {
      type: {
        type: String, 
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price : Number,
    description : String,
    location : String,
    author : {
      type :schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
     ]
},opts)
AcomodoSchema.virtual("properties.popupMarkup").get(function (){
        return `<strong><a href="/Accomodation/${this._id}">${this.title}</a><strong>
        <p>${this.description.substring(0,20)}...</p>`
})
AcomodoSchema.post('findOneAndDelete',async function(req,res)
{
    
  if (req) {
    await Review.deleteMany({
        _id : {
            $in : req.reviews
        }
    })
  }
})
module.exports = mongoose.model('Acomodo',AcomodoSchema);