var Comment = require('../models/comment');
var _ = require('underscore');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
  if(typeof ret === 'undefined' || ret.success == false) {
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
  var articleId = req.query.article;
  Comment.find({article: articleId}).populate('from', 'name').populate('reply.from reply.to', 'name')
  .exec(function(err, comments) {
    if (err) {
      jsonWrite(res, {
        'success': false,
        'errMsg': err
      });
    }
    jsonWrite(res, {
      'success': true,
      'result': comments
    });
  });

};


//admin post article
exports.save = function (req, res) {
  var _comment = JSON.parse(req.query.comment);
  _comment.from = '匿名';
  _comment.to = '匿名';
  var articleId = _comment.article;
  if (_comment.cid) {
    Comment.findById(_comment.cid, function (err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.to,
        content: _comment.content
      }
      comment.reply.push(reply);
    comment.save(function (err, comment) {
      if(err) {
        return jsonWrite(res, {
          'success': false,
          'errMsg': err
         });
      }
      return jsonWrite(res, {
          'success': true,
          'result': comment
        });
      });
    });
  } else {
    var comment = new Comment(_comment)
    comment.save(function (err, comment) {
      if(err) {
        return jsonWrite(res, {
          'success': false,
          'errMsg': err
         });
      }
      return jsonWrite(res, {
          'success': true,
          'result': comment
        });
      });
  }
};

