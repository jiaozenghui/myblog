var Article = require('../models/article');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var multiparty = require('multiparty')
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
Date.prototype.Format = function (fmt) {
	var o = {
	  'M+': this.getMonth() + 1,
	  'd+': this.getDate(),
	  'H+': this.getHours(),
	  'm+': this.getMinutes(),
	  's+': this.getSeconds(),
	  'S+': this.getMilliseconds()
	};
	//因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
	if (/(y+)/.test(fmt)) {
	  //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
	  fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
	  if (new RegExp('(' + k + ')').test(fmt)) {
		//第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
	  }
	}
	return fmt;
  };
/* var dateFormatter= function(value) { 
	var date = moment.parseZone(value).local().format('YYYY-MM-DD HH:mm:ss');
	return date;
} */
var dateFormatter= function(time){
    var localTime = (new Date(time)) - (new Date().getTimezoneOffset())*60*1000;
    localTime = new Date(localTime).Format('yyyy-MM-dd HH:mm:ss');
	return localTime;
  }

//admin post article
exports.save = function (req, res) {
	console.log(req.body)
	var articleObj = req.body.article;
	var article_image = req.body.article_image;
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

		/* 生成multiparty对象，并配置上传目标路径 */
		let form = new multiparty.Form();
		// 设置编码
		form.encoding = 'utf-8';
		// 设置文件存储路径，以当前编辑的文件为相对路径
		form.uploadDir = 'app/public/images/articles';
		form.parse(req, function (err, fields, files) {
			console.log(fields)
			try {
			  let inputFile = files.file[0];
			  let newPath = form.uploadDir + "/" + inputFile.originalFilename;
			  // 同步重命名文件名 fs.renameSync(oldPath, newPath)
		　　　 //oldPath  不得作更改，使用默认上传路径就好
			  fs.renameSync(inputFile.path, newPath);
			  res.send({ data: "上传成功！" });
			} catch (err) {
			  console.log(err);
			  res.send({ err: "上传失败！" });
			};
		  })
		  _article.save(function (err, article) {
		    if (err) {
		      return jsonWrite(res, {
		      	'success': false,
		      	'errMsg': err
		      });
		    }

			
			let content = `<h3 class="about_h">您现在的位置是：<a href="/">首页</a>><a href="/`+article.p_level+`">`+article.p_level_name+`</a></h3>
			<div class="about">
			  <h2>`+article.title+`</h2>
			  <div class="form-group-right" id="article_detail">
				  `+article.content+`
			  </div>
			</div>`;
			fs.unlink('app/views/articles/' + article._id+ ".ejs",function(err){

				if(err){
					return jsonWrite(res, {
						'success': false,
						'errMsg': err
					});
				}
	
				fs.appendFile('app/views/articles/' + article._id+ ".ejs",content,function (err) {
					if (err) {
						return jsonWrite(res, {
							'success': false,
							'errMsg': err
						});
					};
				});
			
			})

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
		console.log(articleObj)
		_article = new Article(articleObj);
		var categoryId = articleObj.category;
		_article.save(function (err, article) {
		    if (err) {
		      return jsonWrite(res, {
		      	'success': false,
		      	'errMsg': err
		      });
		    }
			let content = `<h3 class="about_h">您现在的位置是：<a href="/">首页</a>><a href="/`+article.p_level+`">`+article.p_level_name+`</a></h3>
			<div class="about">
			  <h2>`+article.title+`</h2>
			  <div class="form-group-right" id="article_detail">
				  `+article.content+`
			  </div>
			</div>`


			fs.appendFile('app/views/articles/' + article._id+ ".ejs",content,function (err) {
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
	var pageIndex = req.query.page? req.query.page: 1;
	var pageSize = req.query.pageSize? req.query.pageSize:10;
	Article.findList(pageIndex, pageSize,null, function(err, articles) {
		for(var i=0; i < articles.length; i++) {
			articles[i]['createAt'] = dateFormatter(articles[i].meta.createAt);
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
	var pageIndex = 1;
	var pageSize = 10;
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
exports.getDetail = function(id, cb) {
  Article.findById(id, function (err, article) {
  	if (err) {
      cb&&cb({
      	'success': false,
      	'errMsg': err
      });
	  return;
	}
    Article.update({_id: id}, {$inc: {pv:1}}, function (err) {
      if (err) {
	      cb&&cb({
	      	'success': false,
	      	'errMsg': err
	      });
		  return;
      }
    });
	cb&&cb({
		'success': true,
		'result': article
	});
	return;
  });
}

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