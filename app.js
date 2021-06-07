var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var app = express();
//加载ueditor 模块  
var ueditor = require("ueditor");  


// connect to mongodb
var dbName = 'blog';
var dbUrl = 'mongodb://localhost:27017/' + dbName;
var mongoOptions = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
}
mongoose.connect(dbUrl, mongoOptions);
mongoose.connection.on('error', function (err) {
    console.log('Mongo Error:' + err);
}).on('open', function () {
    console.log('Connection opened');
});


app.use(session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

app.set('views', path.join(__dirname, 'app/views/pages'));//视图目录
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
// rewrite to load static resources
app.use(express.static(path.join(__dirname, 'app/public')));
require('./config/routes')(app)
//使用模块  
app.use("/libs/ueditor/ue", ueditor(path.join(__dirname, 'app/public'), function (req, res, next) {  
    // ueditor 客户发起上传图片请求  
    console.log('jiaozhuedit')
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;  
  
        var imgname = req.ueditor.filename;  
  
        var img_url = '/images/ueditor/';  
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开  
    }  
    //  客户端发起图片列表请求  
    else if (req.query.action === 'listimage') {  
        var dir_url = '/images/ueditor/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  
    }  
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/libs/ueditor/jsp/config.json');  
    }  
})); 

module.exports = app;
