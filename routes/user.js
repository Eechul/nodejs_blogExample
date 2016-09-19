
// Get users listing

exports.list = function(req, res) {
  res.send('respond with a resource');
};

// Get login page

exports.login = function(req, res, next) {
  res.render('login');
};

// Get logout router

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

// POST authenticate route
// exports.authenticate = function(req, res, next) {
//   res.redirect('/admin');
// };
exports.authenticate = function(req, res, next) {
  if(!req.body.email || !req.body.password) {
    return res.render('login', {
      error: 'Please enter your email and password'
    });
  }
  console.log(req.body.email,req.body.password);
  // mongoskin
  // req.collections.users.findOne({

  // mongoose
  req.models.User.findOne({
    email: req.body.email,
    password: req.body.password
  }, function(error, user) {
    if(error) return next(error);
    if(!user) return res.render('login', {
        error : 'Incorrect email&password combination'
    });
    req.session.user = user;
    req.session.admin = user.admin;
    console.log('req', req.session.user, req.session.admin);
    res.redirect('/admin');
  });
};
