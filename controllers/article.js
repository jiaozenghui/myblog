var Article = require('../models/article');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var moment = require('moment')
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

/* var dateFormatter= function(value) { 
	var date = moment.parseZone(value).local().format('YYYY-MM-DD HH:mm:ss');
	return date;
} */
var dateFormatter= function(time){
    const localTime = (new Date(time)) - (new Date().getTimezoneOffset())*60*1000;
    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
  }

//admin post article
exports.save = function (req, res) {
	var articleObj = JSON.parse(req.query.article);
	var _article;
	var id = articleObj.id;
	articleObj.author = req.session.user._id;
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
			let artile_content = 
			fs.appendFile('app/public/pages/articles/' + article._id+ ".html",article.content,function (err) {
				if (err) {
					return jsonWrite(res, {
						'success': false,
						'errMsg': err
					});
				};
			});
			Category.findById(categoryId, function(error,category) {
				if (error) {
					return jsonWrite(res, {
						'success': false,
						'errMsg': error
					});
				} else {
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
	var pageIndex = req.query.pageIndex;
	var pageSize = req.query.pageSize;
	Article.findList(pageIndex, pageSize,null, function(err, articles) {
		articles.forEach(function(item) {
			item.meta.createAt = dateFormatter(item.meta.createAt);
		});
	    if (err) {
	      return jsonWrite(res, {
	      	'success': false,
	      	'errMsg': err
	      });
	    } else {
			Article.getTotal(function(err, list) {
				if (err) {
				  return jsonWrite(res, {
					  'success': false,
					  'errMsg': err
				  });
				}
				return jsonWrite(res, {
					'success': true,
					'result': articles,
					'total': list.length
				});
			});
		}
	});
};

exports.getList = function(req, cb) {
	console.log('begin')
	var pageIndex = req.query.pageIndex? req.query.pageIndex: 1;
	var pageSize = req.query.pageSize? req.query.pageSize:10;
	Article.findList(pageIndex, pageSize,null, function(err, articles) {
		console.log('find begin')
		console.log(articles)
/* 		articles.forEach(function(item) {
			console.log(item.meta.createAt);
			item.meta.createAt = dateFormatter(item.meta.createAt);
			console.log(item.meta.createAt);
		}); */
		for(var i=0; i < articles.length; i++) {
			articles[i].meta.createAt = dateFormatter(articles[i].meta.createAt);
			console.log(articles[i].meta.createAt);
		}

	    if (err) {
	      cb({
	      	'success': false,
	      	'errMsg': err
	      });
		  return;
	    } else {
			Article.getTotal(function(err, list) {
				if (err) {
				  cb({
					  'success': false,
					  'errMsg': err
				  });
				  return;
				}
				cb({
					'success': true,
					'result': articles,
					'total': list.length
				});
				return;
			});
		}
	});
};


exports.statistics = function(req, res) {
	var pageIndex = req.query.pageIndex? req.query.pageIndex: 1;
	var pageSize = req.query.pageSize? req.query.pageSize:10;
	Article.findList(pageIndex, pageSize,{'pv': 'desc'}, function(err, articles) {
	    if (err) {
	      return jsonWrite(res, {
	      	'success': false,
	      	'errMsg': err
	      });
	    } else {
			Article.getTotal(function(err, list) {
				if (err) {
				  return jsonWrite(res, {
					  'success': false,
					  'errMsg': err
				  });
				}
				let pv_total=0;
				let pc_total=0
				list.forEach(function(v,n) {
					pv_total += v.pv;
					pc_total += v.pc;
				});
				return jsonWrite(res, {
					'success': true,
					'result': articles,
					'total': list.length,
					'pv_total': pv_total,
					'pc_total': pc_total
				});
			});
		}
	});
}

exports.getStatistics = function(req, cb) {
	var pageIndex = req.query.pageIndex? req.query.pageIndex: 1;
	var pageSize = req.query.pageSize? req.query.pageSize:10;
	Article.findList(pageIndex, pageSize,{'pv': 'desc'}, function(err, articles) {
	    if (err) {
	      cb({
				'success': false,
				'errMsg': err
			});
			return;
	    } else {
			Article.getTotal(function(err, list) {
				if (err) {
				  cb({
						'success': false,
						'errMsg': err
					});
					return;
				}
				let pv_total=0;
				let pc_total=0
				list.forEach(function(v,n) {
					pv_total += v.pv;
					pc_total += v.pc;
				});
				cb({
					'success': true,
					'result': articles,
					'total': list.length,
					'pv_total': pv_total,
					'pc_total': pc_total
				});
				return;
			});
		}
	});
}

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