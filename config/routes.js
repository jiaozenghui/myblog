var Article = require('../controllers/article');
var User = require('../controllers/user');
var Category = require('../controllers/category');
var Comment = require('../controllers/comment');
var Travel = require('../controllers/travel');

module.exports= function (app) {

	app.get('/api/data', Travel.list);
	app.get('/api/cities', Travel.getCities);

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
		try {
			var deleteReq = false;
			Article.getStatistics(req, function(statics) {
				var template ="articles";
				var blog_title ="首页";
				var renderData={statics: statics, type: ''};
				if (req.url.indexOf('aboutme.html')>-1) {
					template ="about";
					blog_title ="关于我";
				} else if (req.url.indexOf('qianduanjishu.html')>-1
				|| req.url.indexOf('life_diary.html')>-1
				|| req.url.indexOf('drawing.html')>-1) {
					var tep_url = req.url.substring(req.url.lastIndexOf("/")+1);
					var type =tep_url.substring(0, tep_url.indexOf("."));
					req.query.type = type;
					template = 'query_article';
					renderData['category'] = type;
					if (type == 'qianduanjishu') {
						renderData['category_name'] = '前端技术';
					} else if (type == 'life_diary') {
						renderData['category_name'] = '慢生活';
					} else {
						renderData['category_name'] = '兴趣爱好';
					}
					blog_title =renderData['category_name'];
	
				} else if (req.url.indexOf('search.html')>-1){
					template = 'query_article';
					renderData['category'] = 'search';
					renderData['category_name'] = '搜索';
					renderData['filter'] = req.query.filter;
					blog_title =renderData['category_name']+ '-' + req.query.filter;
	
				} else if (req.url.indexOf('articles/edit')>-1) {
					template ="edit";
				} else if (req.url.indexOf('articles/detail')>-1) {
					var id_url = req.url.substring(req.url.lastIndexOf("/")+1);
					var art_template = './articles/'+ id_url.substring(0, id_url.lastIndexOf("."));
					template ="detail";
					renderData['art_template'] = art_template;
					renderData['type'] = 'detail';
					renderData['article_id'] = id_url.substring(0, id_url.lastIndexOf("."));
				} else if (req.url.indexOf('articles/deleted/detail')>-1) {
					deleteReq = true;
					var id_url = req.url.substring(req.url.lastIndexOf("/")+1);
					var art_template = './articles/'+ id_url;
					template ="detail";
					renderData['art_template'] = art_template;
					renderData['type'] = 'detail';
					renderData['article_id'] = id_url;
				}
				renderData['template'] = template;
				renderData['blog_title'] = blog_title;
				if (template == "articles"
				|| template =='query_article'
				) {
					Article.getList(req, function(response) {
						if (response.success == true) {
							renderData["articles"] =  response.result;
							renderData["total"] =  response.total;
							res.render('index',renderData);
						}
					});
				} else if(template == "detail"){
					if (deleteReq) {
						res.render('index',renderData);
					}
					deleteReq&&Article.getDetail(renderData['article_id'], function(re) {
						if (re.success== true && re.result) {
							renderData.statics.pv_total +=1 ;
							renderData['blog_title'] = re.result.title;
							res.render('index',renderData);
						} else {
							res.writeHead(302,{'Location':'/'});
							res.end();
						}
					});
				} else {
					res.render('index',renderData);
					/* res.sendfile('index.html', {root: path.join(__dirname, 'app/views')}); */
				}
			});
		} catch (error) {
			console.log(error);
			res.render('lost')
		}	
	});
}
