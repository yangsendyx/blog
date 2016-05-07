
var admin = require('./controller/admin');
var article = require('./controller/article');
var demo = require('./controller/demo');
var msg = require('./controller/msg');

module.exports = function(app) {

	// admin
	app.get('/admin', admin.signIn);
	app.get('/admin/home', admin.verify, admin.home);
	app.get('/admin/demo', admin.verify, admin.demo);
	app.get('/admin/article', admin.verify, admin.article);
	app.get('/admin/demo/list', admin.verify, admin.demoList);
	app.get('/admin/article/list', admin.verify, admin.articleList);
	app.get('/admin/article/update/:id', admin.verify, admin.articleUpdate);
	// admin POST API
	app.post('/admin/login', admin.login);
	app.get('/admin/logout', admin.verify, admin.logout);
	app.post('/admin/update/article', admin.verify, admin.updateArticle);
	app.post('/admin/update/demo', admin.verify, admin.updateDemo);
	// admin DELETE API
	app.delete('/admin/demo/list/del/:id', admin.verify, admin.demoListDel);
	app.delete('/admin/article/list/del/:id', admin.verify, admin.articleListDel);


	// 文章API
	app.get('/article/list', article.list);
	app.get('/article/category', article.category);
	app.get('/article/:id', article.article);
	app.get('/article/comment/:id', article.comment);
	// save comment
	app.post('/article/comment/save/:id', article.save);


	// demoAPI
	app.get('/demo/list', demo.list);


	// 留言API
	app.get('/message/list', msg.list);
	// save
	app.post('/message/save', msg.save);
};
