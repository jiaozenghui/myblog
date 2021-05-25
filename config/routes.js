var Article = require('../controllers/article');
var User = require('../controllers/user');
var Category = require('../controllers/category');
var Comment = require('../controllers/comment');

module.exports= function (app) {

	//Article
	app.post('/admin/artice/new', Article.save);
	app.get('/articles', Article.list);
	app.get('/article/:id', Article.detail);
	app.delete('/article/delete/:id', Article.delete);

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
}
