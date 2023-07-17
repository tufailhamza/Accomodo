const User = require('../models/user')
module.exports.REnderREgister = (req,res)=>
{
    res.render('users/register');
}
module.exports.PostingReviews = async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser,err=>
        {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Accomodo');
            res.redirect('/');
        })
  
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
    }
  }
  module.exports.RenderLogin = (req,res)=>
  {
    res.render('users/login')
  }

  module.exports.PostingLogin =(req,res)=>
  {
     req.flash('success',"Welcome Back");
     
    const OgUrl = req.body.value|| '/'
     res.redirect(OgUrl)
  }
  module.exports.Logginout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      req.flash('success', 'You have been logged out');
      res.redirect('/');
    });
  }