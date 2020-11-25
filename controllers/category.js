var Category = require('../models/category');
var _ = require('underscore');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

//list page
exports.list = function(req, res) {
  Category.fetch(function(err, catetories) {
    if (err) {
      jsonWrite(res, {
        'success': false,
        'errMsg': err
      });
    }
    jsonWrite(res, {
      'success': true,
      'result': catetories
    });
  });
};

//admin post movie category
exports.save = function (req, res) {
  var id = req.body.category._id;
  var categoryObj = req.body.category;
  var _category;
  if (id !== "undefined") {
    Category.findById(id, function (err, category) {
      if (err) {
        console.log(err);
      }
      _category = _.extend(category, categoryObj);
      _category.save(function (err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/category/list');
      });
    });

  } else {
    _category = new Category({
      name: categoryObj.name,
    });
    _category.save(function (err, category) {
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/category/list');
    });
  }
};


//admin page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: '后台电影分类录入页',
    category:{
        name: ''
    }
  });
};

