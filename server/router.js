
var admin = require('./controller/admin');

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
	app.post('/admin/login', admin.verify, admin.login);
	app.post('/admin/update/article', admin.verify, admin.updateArticle);
	app.post('/admin/update/demo', admin.verify, admin.updateDemo);
	// admin DELETE API
	app.delete('/admin/demo/list/del/:id', admin.verify, admin.demoListDel);
	app.delete('/admin/article/list/del/:id', admin.verify, admin.articleListDel);


	// 
};
