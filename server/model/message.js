
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;

var MsgSchema = new Schema({
	from: String,
	msg: String,
	qq: Number,
	time: Date,
	reply: [{
		from: String,
		to: String,
		qq: Number,
		msg: String,
		time: Date
	}]
});

MsgSchema.statics = {
	findAll: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByID: function(id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
};

module.exports = mongoose.model('message', MsgSchema);