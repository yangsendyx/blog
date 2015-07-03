
var _ = require('underscore');
var moment = require('moment');
var Article = require('../model/article');
var Category = require('../model/category');

exports.list = function(req, res) {
	var start = parseInt(req.query.start);
	var type = req.query.type;
	
	if( type == 'all' ) {
		Article.find({}, {'article': 0, "name": 0, "path": 0, "__v": 0, "category": 0})
		.sort({'meta.updateAt': -1})
		.exec(function(err, articles) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'read articles list error' });
			}
			var length = articles.length;
			var data = articles.slice(start, start+9);

			res.json({ type: 'ok', data: data, length: length });
		});
	} else {
		Category.findOne({_id: type})
		.populate({
			path: 'articles',
			select: {'article': 0, "name": 0, "path": 0, "__v": 0, "category": 0},
			options: { sort: {'meta.updateAt': -1} }
		}).exec(function(err, category) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'read articles list error' });
			}
			var articles = category.articles;

			var length = articles.length;
			var data = articles.slice(start, start+9);

			res.json({ type: 'ok', data: data, length: length });
		});
	}
};


exports.category = function(req, res) {
	Category.findAll(function(err, categories) {
		if( err ) {
			console.log(err);
			return res.json({ type: 'fail', info: 'read categories wrong' });
		}
		var data = [];
		_.each(categories, function(el, i) {
			var json = {
				_id: el._id,
				name: el.name,
				length: el.articles.length
			};
			data.push( json );
		});
		res.json({ type: 'ok', data: data });
	});
};


exports.article = function(req, res) {

};