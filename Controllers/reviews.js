const accomo = require('../models/accomo');
const Review = require('../models/review');

module.exports.PostingRevies = async(req,res)=>
{
  const accomodation =await accomo.findById(req.params.id);
  const review = await new Review(req.body.Review)
  review.author = req.user._id;
    accomodation.reviews.push(review);

  await review.save();
  await accomodation.save();
  req.flash('success','Created new Review')
  res.redirect(`/Accomodation/${accomodation._id}`)
}
module.exports.DestroyReviews =async(req,res)=>
{
  const {id,reid}= req.params;
  const review = await Review.findById(reid);
  if (!review.author.equals(req.user._id)) {
    req.flash('error',"You do not have permisiion to do that");
   res.redirect(`/Accomodation/${id}`)
 }else
 {
  await accomo.findByIdAndUpdate(id,{$pull : { reviews: reid}});
  await Review.findByIdAndDelete(reid);
  req.flash('success','Deleted Sucessfully')
  res.redirect(`/Accomodation/${id}`);
 }
}