
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DemoSchema = new Schema({
	title: String,
	desc: String,
	path: String,
	height: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

DemoSchema.pre('save', function(next) {
	if( this.isNew ) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

DemoSchema.statics = {
	findAll: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByID: function(id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
};

module.exports = mongoose.model('demo', DemoSchema);