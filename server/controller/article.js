
var _ = require('underscore');
var moment = require('moment');
var Article = require('../model/article');
var Category = require('../model/category');
var Reply = require('../model/reply');

exports.list = function(req, res) {
	var start = parseInt(req.query.start);
	var type = req.query.type;
	
	if( type == 'all' ) {
		Article.find({}, {'article': 0, "name": 0, "path": 0, "__v": 0, "category": 0, "text": 0})
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
			var len = el.articles.length;
			if( len ) {
				var json = {
					_id: el._id,
					name: el.name,
					length: len
				};
				data.push( json );
			}
		});
		res.json({ type: 'ok', data: data });
	});
};


exports.article = function(req, res) {
	var id = req.params.id;
	Article.findOne({_id: id}, {'_id': 0, 'name': 0, 'path': 0, 'desc': 0, '__v': 0, "text": 0})
	.populate({
		path: 'category',
		select: {'name': 1, '_id': 0}
	}).exec(function(err, article) {
		if( err ) {
			console.log(err);
			return res.json({ type: 'fail', err: 'read article error' });
		}
		res.json({ type: 'ok', data: article });
	});
};


exports.comment = function(req, res) {
	var id = req.params.id;
	Reply.find({ article: id }, {'article': 0, '__v': 0})
	.sort({ '_id': -1 })
	.exec(function(err, replies) {
		if( err ) {
			console.log( err );
			return res.json({ type: 'fail', info: 'read comment error' });
		}
		var arr = replies.slice(0, 50);
		var data = [];
		_.each(arr, function(el, i) {
			var len = el.reply.length;
			var json = {
				_id: el._id,
				from: el.from,
				qq: el.qq,
				time: el.time,
				msg: el.msg
			};
			if( len > 5 ) {
				json.reply = el.reply.slice(len-5);
			} else {
				json.reply = el.reply;
			}
			data.push( json );
		});
		res.json({ type: 'ok', data: data });
	});
};


exports.save = function(req, res) {
	var data = req.body;
	var articleId = req.params.id;

	if( data.id ) {
		Reply.findByID(data.id, function(err, reply) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'read comment error' });
			}
			var newData = {
				from: data.from,
				to: data.to,
				qq: data.qq,
				msg: data.msg,
				time: Date.now()
			};
			reply.reply.push( newData );
			reply.save(function(err, reply) {
				if( err ) {
					console.log( err );
					return res.json({ type: 'fail', info: 'save comment error' });
				}
				res.json({ type: 'ok' });
			});
		});
	} else {
		new Reply({
			article: articleId,
			from: data.from,
			msg: data.msg,
			qq: data.qq,
			time: Date.now()
		}).save(function(err, reply) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'save reply error' });
			}
			res.json({ type: 'ok' });
		});
	}
};