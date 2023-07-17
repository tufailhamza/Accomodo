const {accomoSchema} = require('./schema')
const ExpressError = require('./Utils/ExpressError');
const {reviewSchema} = require('./schema');
const Review = require('./models/review');

 const Checkauthentication = (req,res,next)=>
{
    
   
    if (!req.isAuthenticated()) {
        req.session.returnTo= req.originalUrl;
      req.flash('error','You must be signed in')
        return res.redirect('/login')
       }
       next();
}
const validateAccomodation = (req,res,next)=> 
{
   const {error} = accomoSchema.validate(req.body)
   if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else
  {
   next();
  }
}
const isAuthor = async (req,res,next)=>{
  const {id} = req.params;
  const Accomodation = await Accomo.findById(id);
  
  if (!Accomodation.author.equals(req.user._id)) {
    req.flash('error',"You do not have permisiion to do that");
   return res.redirect(`/Accomodation/${id}`)
 }else
 {
  next();
 }
}



const validateReview = (req,res,next)=>
{
  
  const {error} = reviewSchema.validate(req.body.reviews)

  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else
  {
   next();
  }
}

module.exports= Checkauthentication,isAuthor,validateAccomodation,validateReview;
