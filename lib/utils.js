//app.use(function(req, res, next) {
function loginCheck(req, res, next) {
  console.log("LoginCheck req.session.user = ", req.session.user);
  if (req.session.user === undefined) {  
    console.log("Rendering user/login");
    return res.render('user/login', { message: 'Please Login To Your Account' });
  } else {
    res.locals.user = req.session.user;
    next();
  }
};

function apiLoginCheck(req, res, next) {
  //console.log("LoginCheck req.session.user = ", req.session.user);
  if (req.session.user === undefined) {  
    return res.status(500).send({ error: "user not logged in!" });
  } else {
    next();
  }
};

function passUser(req, res, next) {
  if (req.session.user !== undefined) {
    res.locals.user = req.session.user;
    next();
  }
}


module.exports = { loginCheck, apiLoginCheck, passUser }