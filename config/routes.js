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
		Article.getStatistics(req, function(statics) {
			var template ="articles";
			var renderData={statics: statics, type: ''};
			if (req.url.indexOf('articles/edit')>-1) {
				template ="edit";
			} else if (req.url.indexOf('articles/detail')>-1) {
				var id_url = req.url.substring(req.url.lastIndexOf("/")+1);
				template = './articles/'+ id_url.substring(0, id_url.lastIndexOf("."));
				renderData['type'] = 'detail';
			}
			renderData['template'] = template;
			if (template == "articles") {
				Article.getList(req, function(response) {
					if (response.success == true) {
						renderData["articles"] =  response.result;
						res.render('index',renderData);
					}
				});
			} else {
				res.render('index',renderData);
				/* res.sendfile('index.html', {root: path.join(__dirname, 'app/views')}); */
			}
		});

		
	});
}
