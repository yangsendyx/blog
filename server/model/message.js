
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = Schema.Types.ObjectId;

var MsgSchema = new Schema({
	from: String,
	msg: String,
	qq: Number,
	time: {
		type: Date,
		default: Date.now()
	},
	reply: [{
		from: String,
		to: String,
		qq: Number,
		msg: String,
		time: {
			type: Date,
			default: Date.now()
		}
	}]
});

/*MsgSchema.pre('save', function(next) {
	if( this.isNew ) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});
*/
MsgSchema.statics = {
	findAll: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByID: function(id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
};

module.exports = mongoose.model('message', MsgSchema);