
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
  res.redirect('/');
};

// POST authenticate route

exports.authenticate = function(req, res, next) {
  res.redirect('/admin');
};
