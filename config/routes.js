var Article = require('../controllers/article');
var User = require('../controllers/user');
var Category = require('../controllers/category');
var Comment = require('../controllers/comment');
const { template } = require('underscore');

module.exports= function (app) {

	//Article
	app.post('/admin/artice/new', Article.save);
	app.get('/articles', Article.list);
	app.get('/article/:id', Article.detail);
	app.delete('/article/delete/:id', Article.delete);

	app.get('/statistics', Article.statistics);
	//Login
	app.get('/login', User.showSignin);
	app.get('/signup', User.showSignup);
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signout', User.signout);
	app.get('/user/get',User.signinRequired, User.getUser)

	//catagory
	app.get('/categories', User.signinRequired, Category.list);

	//comment
	app.post('/user/comment', Comment.save);
	app.get('/comment/list', Comment.list);

	// static views
	app.all('/*', function (req, res) {
		Article.statistics1(req, function(statics) {
			var template ="";
			switch(req.url) {
				case req.url.indexOf('articles/edit')>-1:
					template ="edit";
					break;
				case req.url.indexOf('article/detail')>-1:
					template = req.url.substring(req.url.lastIndexOf("/")+1).substring(0, req.url.lastIndexOf("/")+1);
					break;
				default:
					template = "articles";
			}
			console.log(template)
			if (req.url.indexOf('detail')>-1) {
				res.render('index',{statics:statics});
			} else {
				console.log("testadsafdw")
				console.log(statics)
				res.render('index',{
					statics:statics,
					template:template
				});
				/* res.sendfile('index.html', {root: path.join(__dirname, 'app/views')}); */
			}
		});

		
	});
}
