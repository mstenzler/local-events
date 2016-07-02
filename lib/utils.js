//app.use(function(req, res, next) {
function loginCheck(req, res, next) {
  console.log("LoginCheck req.headers = ", req.headers);
  if (req.session.user == undefined) {  
    console.log("Rendering user/login");
    return res.render('user/login', { message: 'Please Login To Your Account' });
  } else {
    res.locals.user = req.session.user;
    next();
  }
};

module.exports = { loginCheck }