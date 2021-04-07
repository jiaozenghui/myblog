var Article = require('../models/article');
var Category = require('../models/category');
var _ = require('underscore');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	res.json(ret);
/* 	if(typeof ret === 'undefined' || ret.success == false) {
		res.json({
			code:'1',
			msg: '操作失败',
			ret: ret
		});
	} else {
		res.json(ret);
	} */
};


//admin post article
exports.save = function (req, res) {
	var articleObj = JSON.parse(req.query.article);
	var _article;
	var id = articleObj.id;
	if (id) {
		Article.findById(id, function (err, article) {
		  if (err) {
		      return jsonWrite(res, {
		      	'success': false,
		      	'errMsg': err
		      });
		  }

		  var oldCategoryId = article.category;	
		  _article = _.extend(article, articleObj);


		  _article.save(function (err, article) {
		    if (err) {
		      return jsonWrite(res, {
		      	'success': false,
		      	'errMsg': err
		      });
		    }

			  if (article.category != oldCategoryId) {
			  	if (oldCategoryId) {
		            Category.findById(oldCategoryId, function(err,category) {
		              category.articles.remove(article._id);
		              category.save(function(err, category) {
	              	    if (err) {
					      return jsonWrite(res, {
					      	'success': false,
					      	'errMsg': err
					       });
	              	    }
		              });
		            });
		            Category.findById(_article.category, function(err,category) {
		              category.articles.push(_article._id);
		              category.save(function(err, category) {
						return jsonWrite(res, {
							'success': true,
							'result': article
						});
		              });
		            });
			  	}
			  }
		  });
		});
	} else {
		_article = new Article(articleObj);
		var categoryId = articleObj.category;
		_article.save(function (err, article) {
		    if (err) {
		      return jsonWrite(res, {
		      	'success': false,
		      	'errMsg': err
		      });
		    }
			console.log("jzhhhhhhh" + categoryId)
			Category.findById(categoryId, function(error,category) {
				console.log("jiasoxcffdh")
				console.log(err)
				if (error) {
					return jsonWrite(res, {
						'success': false,
						'errMsg': error
					});
				} else {
					console.log("category_articles")
					console.log(category.articles)
					category.articles.push(article._id);
					category.save(function(err, category) {
						console.log("jiasoxh")
						console.log(err)
						if (err) {
							return jsonWrite(res, {
								'success': false,
								'errMsg': err
							});
						}
						return jsonWrite(res, {
							'success': true,
							'result': article
						});
					});
				}

			});
		});
	}
};

//list
exports.list = function(req, res) {
/*  Article.fetch(function(err, articles) {
    if (err) {
      return jsonWrite(res, {
      	'success': false,
      	'errMsg': err
      });
    }
	return jsonWrite(res, {
		'success': true,
		'result': articles
	});
  });*/
	Article.findList(function(err, articles) {
	    if (err) {
	      return jsonWrite(res, {
	      	'success': false,
	      	'errMsg': err
	      });
	    }
		return jsonWrite(res, {
			'success': true,
			'result': articles
		});
	});
};

//detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Article.findById(id, function (err, article) {
  	if (err) {
      return jsonWrite(res, {
      	'success': false,
      	'errMsg': err
      });
	}
    Article.update({_id: id}, {$inc: {pv:1}}, function (err) {
      if (err) {
	      return jsonWrite(res, {
	      	'success': false,
	      	'errMsg': err
	      });
      }
    });
	return jsonWrite(res, {
		'success': true,
		'result': article
	});
  });
}

//list delete article
exports.delete = function(req, res) {
  var id = req.params.id;
  console.log(id)
  if (id ) {
    Article.remove({_id: id}, function (err, article) {
      if (err) {
		return jsonWrite(res, {
		  'success': false,
		  'errMsg': err
		});
      }
	return jsonWrite(res, {
		'success': true,
		'result': article
	});
    });
  }
};