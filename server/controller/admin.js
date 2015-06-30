
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var formidable = require('formidable');
var unzip = require('unzip');
var rmdir = require( 'rmdir' );
var User = require('../model/user');
var Demo = require('../model/demo');
var Article = require('../model/article');
var Category = require('../model/category');

// 验证用户后台权限
exports.verify = function( req, res, next ) {
	/*var user = req.session.user || '';
	if( user && user.role >= 10 ) return next();
	if( req.xhr ) {
		res.sendStatus(401);
	} else {
		res.redirect(303, '/admin');
	}*/
	next();
};

// 登陆页面
exports.signIn = function(req, res, next) {
	res.render('signIn');
};

// 后台主页面
exports.home = function(req, res, next) {
	res.render('home', {active: 0});
};

// 文章上传页面
exports.article = function(req, res, next) {
	Category.findAll(function(err, categories) {
		if( err ) return next(err);
		res.render('article', {
			active: 1,
			categories: categories
		});
	});
};

// 文章列表页面
exports.articleList = function(req, res, next) {
	Article.find({})
	.populate('category', 'name')
	.sort('meta.updateAt')
	.exec(function(err, articles) {
		if( err ) return next(err);
		_.each(articles, function(el, i) {
			el.meta.time = moment(el.meta.updateAt).format('YYYY/MM/DD  HH:mm:ss');
		});
		articles.reverse();
		res.render('articleList', {
			active: 2,
			articles: articles
		});
	});
	// res.render('articleList', {active: 2});
};

// 文章修改页面
exports.articleUpdate = function(req, res, next) {
	var id = req.params.id;

	Article.findById(id, function(err, article) {
		if( err ) return next(err);
		Category.findAll(function(err, categories) {
			if( err ) return next(err);
			res.render('article', {
				active: 1,
				article: article,
				categories: categories
			});
		});
	});
};

// demo上传页面
exports.demo = function(req, res, next) {
	res.render('demo', {active: 3});
};

// demo列表页面
exports.demoList = function(req, res, next) {
	Demo.findAll(function(err, demos) {
		if( err ) return next(err);
		_.each(demos, function(el, i) {
			el.meta.time = moment(el.meta.updateAt).format('YYYY/MM/DD  HH:mm:ss');
		});
		demos.reverse();
		res.render('demoList', {active: 4, demos: demos});
	});
};

// 登陆 API
exports.login = function(req, res, next) {
	
};

// 上传文章 API
exports.updateArticle = function(req, res, next) {
	var data = req.body;

	if( data.id !== '' ) {
		Article.findByID(data.id, function(err, article) {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			var count = 0;
			var saveArticle = function() {
				if( count == 2 ) {
					article.title = data.title;
					article.type = data.type;
					article.name = data.name;
					article.path = data.path;
					article.desc = data.desc;
					article.article = data.article;
					article.save(function(err, article) {
						if( err ) return res.json({ type: 'fail', info: err.toString() });
						res.json({ type: 'ok' });
					});
				}
			};

			if( article.category.toString() != data.category ) {
				Category.findByID(article.category, function(err, category) {
					if( err ) return res.json({ type: 'fail', info: err.toString() });
					_.each( category.articles, function(el, i) {
						if( el == article._id.toString() ) {
							category.articles.splice(i, 1);
							return false;
						}
					});
					category.save(function(err, category) {
						if( err ) return res.json({ type: 'fail', info: err.toString() });
						count++; saveArticle();
					});
				});
				if( data.bo == 'true' ) {
					new Category({
						name: data.category,
						articles: [article._id]
					}).save(function(err, category) {
						if( err ) return res.json({ type: 'fail', info: err.toString() });
						article.category = category._id;
						count++; saveArticle();
					});
				} else {
					Category.findByID(data.category, function(err, category) {
						if( err ) return res.json({ type: 'fail', info: err.toString() });
						category.articles.push( article._id );
						category.save(function(err, category) {
							if( err ) return res.json({ type: 'fail', info: err.toString() });
							article.category = category._id;
							count++; saveArticle();
						});
					});
				}
			} else {
				count = 2; saveArticle();
			}
		});
	} else {
		var run = function( category ) {
			new Article({
				title: data.title,
				category: category._id,
				type: data.type,
				name: data.name,
				path: data.path,
				desc: data.desc,
				article: data.article
			}).save(function(err, article) {
				category.articles.push( article._id );
				category.save(function(err, category) {
					if( err ) return res.json({ type: 'fail', info: err.toString() });
					res.json({ type: 'ok' });
				});
			});
		};

		if( data.bo == 'true' ) {
			new Category({
				name: data.category,
				articles: []
			}).save(function(err, category) {
				if( err ) return res.json({ type: 'fail', info: err.toString() });
				run( category );
			});
		} else {
			Category.findByID(data.category, function(err, category) {
				if( err ) return res.json({ type: 'fail', info: err.toString() });
				run( category );
			});
		}
	}
};

// 上传demo API
exports.updateDemo = function(req, res, next) {
	var date = Date.now();

	fs.exists('./public/demo', function(exists) {
		if( exists ) return run();
		fs.mkdir('./public/demo', function() {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			run();
		});
	});

	function run() {
		var newPath = './public/demo/' + date;
		fs.mkdir(newPath, function(err) {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			var form = new formidable.IncomingForm({ uploadDir: newPath, type: true });
			form.parse(req, function(err, fields, files) {
				if( err ) return res.json({ type: 'fail', info: err.toString() });
				
				var count = 0;
				var run = function(path) { if( count === 2 ) res.json({ type: 'ok', path: path }); };

				var data = {
					title: fields.title,
					desc: fields.desc,
					path: '/demo/' + date + '/'
				};

				new Demo(data).save(function(err, demo) {
					if( err ) return res.json({ type: 'fail', info: err.toString() });
					count++; run( demo.path );
				});

				var path2 = newPath + '/' + files.file.name;
				fs.rename(files.file.path, path2, function(err) {
					if( err ) return res.json({ type: 'fail', info: err.toString() });
					if( /zip/g.test(files.file.name) ) {
						var extract = unzip.Extract({ path: newPath + '/' });
						extract.on('error', function(err) { res.json({ type: 'fail', info: err.toString() }); });
						extract.on('finish', function() { count++; run( data.path ); });
						fs.createReadStream( path2 ).pipe( extract );
					} else {
						count++; run( data.path );
					}
				});
			});
		});
	}
};

// 删除demo DEL
exports.demoListDel = function(req, res, next) {
	var id = req.params.id;
	Demo.findById(id, function(err, demo) {
		if( err ) return res.json({ type: 'fail', info: err.toString() });
		var demoPath = demo.path;

		var count = 0;
		var run = function() {
			if( count == 2 ) res.json({ type: 'ok' });
		};

		var newPath = './public' + demoPath;
		rmdir(newPath, function(err, dirs, files) {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			count++; run();
		});

		demo.remove(function(err, demo) {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			count++; run();
		});
	});
};

// 删除文章 DEL
exports.articleListDel = function(req, res, next) {
	var id = req.params.id;
	Article.findByID(id, function(err, article) {
		if( err ) return res.json({ type: 'fail', info: err.toString() });
		var count = 0;
		var articleId = article._id.toString();

		var run = function() {
			if( count == 2 ) res.json({ type: 'ok' });
		};

		Category.findByID(article.category, function(err, category) {
			_.each(category.articles, function(el, i) {
				if( el == articleId ) {
					category.articles.splice(i, 1);
					return false;
				}
			});
			category.save(function(err, category) {
				if( err ) return res.json({ type: 'fail', info: err.toString() });
				count++; run();
			});
		});
		article.remove(function(err) {
			if( err ) return res.json({ type: 'fail', info: err.toString() });
			count++; run();
		});
	});
};