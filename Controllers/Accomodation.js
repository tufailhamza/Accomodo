const Accomo = require('../models/accomo');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapboxToken})
const cloudinary = require('../Cloudinary')
module.exports.index = async (req,res)=> 
{
   const homes = await Accomo.find({});
   res.render('accomodations/index', {homes})
}
module.exports.newAccomodation= (req,res)=>
{
     res.render('accomodations/new')    
}
module.exports.CreateAccomodation = async (req,res,next)=>
{
        const geoData = await geocoder.forwardGeocode({
          query: req.body.Accomodation.location,
          limit:1
        }).send()  
        const Accomodation = new Accomo(req.body.Accomodation)
        Accomodation.geometry = geoData.body.features[0].geometry;
        Accomodation.images = req.files.map(f=>({url:f.path,filename:f.filename}))
        Accomodation.author = req.user._id;
        await Accomodation.save();
        req.flash('success','Successfully made a new Accomodation')
        res.redirect(`/Accomodation/${Accomodation._id}`);
}
module.exports.Updation = async (req,res)=>
{
 const {id}= req.params;
 console.log(req.body);
 const Accomodation = await Accomo.findByIdAndUpdate(id, {...req.body.Accomodation})
 const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
 Accomodation.images.push(...imgs) ;
 await Accomodation.save();
 if (req.body.delteImages) {
  for (const filename of req.body.delteImages) {
    await Accomodation.uploader.destroy(filename);
  }
  await Accomodation.updateOne({$pull : {images: {filename:{$in : req.body.delteImages}}}})
  console.log(Accomodation);
 }
 req.flash('success',"Successfully updated Accomodation")
 res.redirect(`/Accomodation/${Accomodation._id}`)
  
}
module.exports.destroyACcomodation = async (req,res)=>
{
  const {id} = req.params;
  const Accomodation = await Accomo.findByIdAndDelete(id);
  req.flash('success',"Succesfully Deleted Accomodation")
   res.redirect('/Accomodation')
}
module.exports.EditAccomodation = async (req,res)=>
{
  const Accomodation = await Accomo.findById(req.params.id)
  if (!Accomodation) {
    req.flash("error",'Not Availaible!');
    return res.redirect(`/Accomodation/${req.params.id}`);
  }
  
   res.render('accomodations/edit',{Accomodation});
}
module.exports.RenderingAcomodation = async (req,res)=>
{
  const Accomodation = await Accomo.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path:"author"
    }
  }).populate('author')
  if (!Accomodation) {
    req.flash('error','No Accomoddation Found')
    return res.redirect('/Accomodation')
  }
  
  res.render('accomodations/show',{Accomodation});

}