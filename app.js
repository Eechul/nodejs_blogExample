  var express = require('express'),
   path = require('path'),
   favicon = require('serve-favicon'),
   logger = require('morgan'),
   cookieParser = require('cookie-parser'),
   session = require('express-session'),
   bodyParser = require('body-parser'),
   routes = require('./routes/index'),
   users = require('./routes/user'),
  // mongoskin = require('mongoskin'),
  // 기존에 쓰던 db인 mongoskin 대신 mongoose를 씀
   mongoose = require('mongoose'),
   models = require('./models'),
   dbUrl = "mongodb://localhost:27017/nodejs_blogExample",
  //  db = mongo.db(dbUrl, {native_parser:true}),
  //  collections = {
  //   articles: db.collection('articles'),
  //   users: db.collection('users')
  // };
  db = mongoose.connect(dbUrl, { safe:true });



var app = express();
app.locals.appTitle = 'blog-express';

app.use(function(req, res, next) {
  // if(!collections.articles || !collections.users) { // 두 프로퍼티가 비어있다면!
  //   return next(new Error("No collections."));
  // }
  // req.collections = collections;
  // 이렇게 넣어서 보낼수도 있군.. (mongoskin)

  // mongoose
  if(!models.Article || !models.User) {
    return next(new Error('No models'));
  }
  req.models = models;
  return next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('ehdcjFWKdmd'));
app.use(session({
  secret: '2C44774A-D649-4D44-9535-46E296EF984F',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

// 인증 미들웨어
app.use(function(req, res, next) {
  if (req.session && req.session.admin) {
    res.locals.admin = true;
  }
  next();
});

// 권한 부여 미들웨어
var authorize = function(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    console.log('authorize 401');
    return res.send(401);
  }
};

// Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.article.admin);
app.get('/post', authorize, routes.article.post);
app.post('/post', authorize, routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API routes : get post delete put
app.all('/api', authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.delete('/api/articles/:id', routes.article.del);
app.put('/api/articles/:id', routes.article.edit);

app.all('*', function(req, res) {
  res.send(404);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
