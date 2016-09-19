
// Get article page.
exports.show = function(req, res, next) {
  if (!req.params.slug) {
    return next(new Error('No article slug'));
  }
  // mongoskin
  // req.collections.articles.findOne({slug: req.params.slug}, function(error, article) {
  //mongoose
  req.models.Article.findOne({slug: req.params.slug}, function(error, article) {
    if (error) return next(error);
    if (!article.published) return res.send(401);
    res.render('article', article);
  });
};

// Get articles API
exports.list = function(req, res, next) {
  // mongoskin
  // req.collections.articles.find({}).toArray( function(err, articles) {
  // mongoose
  req.models.Article.find({}).toArray(function(error, articles) {
    if (error) return next(error);
    res.send({ articles:articles });
  });
};

exports.add = function(req, res, next) {
  if (!req.body.article) return next(new Error('No article payload'));
  var article = req.body.article;
  article.publish = false;
  // mongoskin
  // req.collections.articles.insert(article, function(error, articleResponse) {
  // mongoose
  req.models.Articles.insert(article, function(error, articleResponse) {
    if(error) return next(error);
    res.send(articleResponse);
  });
};

exports.edit = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  // mongoskin
  // req.collections.articles.updateById(req.params.id, {$set: req.body.article},

  // mongoose 첫번째 방법:
  // Mongoose 도큐먼트를 찾은 후 도큐먼트 메소드인 update 사용
  req.models.Article.findById(req.params.id, function(error, article) {
    if(error) return next(error);
    article.update({$set: req.body.article}, function(error, count, raw) {
      if(error) return next(error);
      res.send({affectedCount: count});
    });
  });
    // function(error, count) {
    //   if (error) return next(error);
    //   res.send({affectedCount : count});
    // });

  // 두번째 방법: 정적 모델 메소드 findByIdAndUpdate 사용
  // req.models.Article.findByIdAndUpdate(
  //   req.params.id,
  //   {$set: req.body.article},
  //   function(error, doc) {
  //     if(error) return next(error);
  //     res.send(doc);
  //   });
};

exports.del = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  // mongoskin
  // req.collections.articles.removeById(req.params.id, function(error, count) {
  //   if (error) return next(error);
  //   res.send({affectedCount: count});
  // });

  // mongoose
  // 첫번째 방법
  req.models.Article.findById(req.params.id, function(error, article) {
    if(error) return next(error);
    if(!article) return next(new Error('article not found'));
    article.remove(function(error, doc) {
      if(error) return next(error);
      res.send(doc);
    });
  });

  // 두번째 방법 (찾아보고 활용하기)
  // req.models.Article.findByIdAndRemove(req.params.id, {$set: req.})
};

exports.post = function(req, res, next) {
  if (!req.body.title)
  res.render('post');
};

exports.postArticle = function(req, res, next) {
  if (!req.body.title || !req.body.slug || !req.body.text) {
    return res.render('post', {error: 'File title, slug and text'});
  }
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  };
  // mongoskin
  // req.collections.articles.insert(article, function(error, articleResponse) {

  // mongoose
  req.models.Article.create(article, function(error, articleResponse) {
    if (error) return next(error);
    res.render('post', {error: 'Artical was added. Publish it on Admin page.'});
  });
};

exports.admin = function(req, res, next) {
  // mongoskin
  // req.collections.articles.find({}, {sort: {_id:-1}}).toArray(function(error, articles) {

  // mongoose
  req.models.Article.list(function(error, articles) {
    if(error) return next(error);
    res.render('admin', {articles:articles});
  });
};
