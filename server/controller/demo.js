
var _ = require('underscore');
var moment = require('moment');
var Demo = require('../model/demo');

exports.list = function( req, res ) {
	var start = parseInt(req.query.start);
	var limit = 9;
	Demo.find({}).sort({id: -1}).exec(function(err, demos) {
		if( err ) {
			console.log(err);
			return res.json({ type: 'fail', info: 'read demos error' });
		}
		demos.reverse();
		var length = demos.length;
		var arr = demos.slice(start, limit + start);

		var data = [];
		_.each(arr, function(el, i) {
			var json = {
				title: el.title,
				desc: el.desc,
				path: el.path,
				height: el.height,
				time: moment(el.meta.createAt).format('YYYY-MM-DD HH:mm:ss')
			};
			data.push(json);
		});
		res.json({ type: 'ok', data: data, length: length });
	});
};