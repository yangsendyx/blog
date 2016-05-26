
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var favicon = require('connect-favicons');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var morgan = require('morgan');

var router = require('./server/router');
var credentials = require('./server/credentials');

var dbUrl = 'mongodb://localhost:3300/blog';
mongoose.connect( dbUrl );

var handlebars = require('express3-handlebars').create({
	defaultLayout:'main',
	helpers: {
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('view cache', false);
app.disable('x-powered-by');

app.use( express.static(__dirname + '/public') );
// app.use( favicon(__dirname + '/public/img/myico.ico') );
app.use( bodyParser.urlencoded({extended: false}) );
app.use( bodyParser.json() );
app.use( cookieParser(credentials.cookie) );
app.use( expressSession({
	resave: false,
	saveUninitialized: true,
	secret: credentials.session,
	cookie: {maxAge: 7200000 },
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

var sysLogStream = fs.createWriteStream(__dirname + '/sys.log', {flags: 'a'});
var losType = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status ":referrer"';
if( app.get('env') === 'development' ) {
	app.set('showStackError', true);
	app.use( morgan(losType, {stream: sysLogStream}) );
	// mongoose.set('debug', true);
}

router( app );

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).render('500', { title: '500 - Server Error.' });
}).use(function(req, res) {
	res.status(404).render('404', { title: '404 - Not Found.' });
});

app.listen('80', function() {
	console.log( 'Express Server Started. content: '+app.get('env') );
});