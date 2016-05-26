
var _ = require('underscore');
var moment = require('moment');
var Msg = require('../model/message');

exports.list = function(req, res) {
	var start = parseInt( req.query.start );
	var limit = 6;
	Msg.find({}).sort({ '_id': -1 }).exec(function(err, msgs) {
		if( err ) {
			console.log( err );
			return res.json({ type: 'fail', info: 'read message error' });
		}
		var len = msgs.length;
		var arr = msgs.slice(start, limit + start);

		var data = [];
		_.each(arr, function(el, i) {
			var json = {
				id: el._id,
				from: el.from,
				qq: el.qq || '',
				msg: el.msg,
				time: el.time
			};
			var replyLen = el.reply.length;
			if( replyLen > 5 ) {
				json.reply = el.reply.slice( replyLen-5 );
			} else {
				json.reply = el.reply;
			}
			
			data.push(json);
		});

		res.json({ type: 'ok', msgs: data, length: len });
	});
};


exports.save = function(req, res) {
	var data = req.body;
	if( data.id ) {
		Msg.findByID(data.id, function(err, msg) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'read message error' });
			}
			var newData = {
				from: data.from,
				to: data.to,
				qq: data.qq,
				msg: data.msg,
				time: Date.now()
			};
			msg.reply.push( newData );
			msg.save(function(err, msg) {
				if( err ) {
					console.log( err );
					return res.json({ type: 'fail', info: 'save message error' });
				}
				res.json({ type: 'ok' });
			});
		});
	} else {
		new Msg({
			from: data.from,
			msg: data.msg,
			qq: data.qq,
			time: Date.now()
		}).save(function(err, msg) {
			if( err ) {
				console.log( err );
				return res.json({ type: 'fail', info: 'read message error' });
			}
			res.json({ type: 'ok' });
		});
	}
};