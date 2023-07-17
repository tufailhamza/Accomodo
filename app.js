if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const joi = require('joi');
const {accomoSchema ,reviewSchema} = require('./schema')
const mongoose = require('mongoose');
const Review = require('./models/review');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const ejsMate = require('ejs-mate');
const methodoverride = require('method-override')
const Accomo = require('./models/accomo');
const ReviewRoute = require('./routes/reviews')
const catchAsync = require('./Utils/WrapAsync');
const ExpressError = require('./Utils/ExpressError');
const AccomodationsRoute = require('./routes/Accomodation') 
const accomo = require('./models/accomo');
const passport = require('passport')
const Localpassport = require('passport-local');
const User = require('./models/user')
const UserRoutes = require('./routes/User')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const session = require('express-session')
const connectmongo = require('connect-mongodb-session')
const MongoDBStore = connectmongo(session);

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Accomo';
main().catch(err => console.log(err));
app.use(express.urlencoded({extended:true}))
//'mongodb://127.0.0.1:27017/Accomo'
async function main() {
  await mongoose.connect(dbUrl,
  {useNewUrlParser:true ,useUnifiedTopology:true});
   console.log("connection open");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.engine('ejs',ejsMate)
app.set('view engine',"ejs")
app.set('ejs',ejsMate)
app.use(cookieParser());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://fonts.gstatic.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://fonts.gstatic.com/"
];
const fontSrcUrls = [
  "https://fonts.gstatic.com/",
  ""
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzhkmbnbn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
                "https://fonts.googleapis.com/",
                "https://fonts.gstatic.com/",
                
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || "This is a secret key"

app.set('views',path.join(__dirname,'views'))
app.use(methodoverride('_method'))
var store = new MongoDBStore({
  uri: dbUrl, 
  secret, 
   collection: 'sessions',
   touchAfter : 24*60*60
});

  store.on("error", function (e) 
  { 
    console.log("Error in MongoDB connection",e)
  })
const sessionConfig = {
  store,
  name:'session',
  secret, 
  resave : false,
  saveUninitialized : true,
  cookie:{
    httpOnly:true,
    expires : Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(express.static(path.join(__dirname,'public')))
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize())
passport.use(new Localpassport(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>
{
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success= req.flash('success');
  res.locals.error= req.flash('error');
  if (req.session.returnTo) {
    req.body.value= req.session.returnTo ;
  }
  next();
})


app.use('/Accomodation',AccomodationsRoute)
app.use('/Accomodation/:id/reviews',ReviewRoute)
app.use('/',UserRoutes);
app.get('/',catchAsync((req,res)=>
{
   res.render('home');
}));
app.all('*',(req,res,next)=>
{
   next(new ExpressError('Page not Found',404))
})
app.use((err,req,res,next)=>
{
  const {status=500 , message = 'Something went Wrong'}=err;
  res.status(status).render('error',{err})
})
app.listen(3000,()=>
{
    console.log('Serving on port 3000');
})