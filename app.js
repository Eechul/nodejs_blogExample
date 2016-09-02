var express = require('express'),
 path = require('path'),
 favicon = require('serve-favicon'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser'),
 routes = require('./routes/index'),
 users = require('./routes/users'),
 mongo = require('mongoskin'),
 //methodOverride = require('methodOverride'),
// Connection URL
 dburl = 'mongodb://localhost:27017/blog',
// Use connect method to connect to the Server
 db = mongo.db(dburl, {safe: true}),
 collection = {
  articles: db.collection('articles'),
  users: db.collection('users')
};


var app = express();
app.locals.appTitle = 'blog-express';
app.use(function(req, res, next) {
  if(!collection.articles || !collections.users){ // 두 프로퍼티가 비어있다면!
    return next(new Error("No collections."));
  }
  req.collections = collections;
  // 이렇게 넣어서 보낼수도 있군..
  req.dongs = "dongdong"; // 예제 써보기
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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