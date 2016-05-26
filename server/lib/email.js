
var nodemailer = require('nodemailer');
var credentials = require('../credentials');

var transporter = nodemailer.createTransport('SMTP', {
	host: 'smtp.qq.com',
    port: 465,
    secureConnection: true,
    auth: {
        user: credentials.mail.user,
        pass: credentials.mail.pass
    }
});

exports.send = function(opt) {
	transporter.sendMail({
		from: 'ysHome<'+credentials.mail.user+'>',
		to: opt.list.join(','),
		subject: opt.title,
		html: opt.body,
		generateTextFromHtml: true
	}, function(err, info) {
		if( err ) return console.log( '邮件发送失败 '+err );
		console.log('邮件已发送 '+info.message);
		transporter.close();
	});
};