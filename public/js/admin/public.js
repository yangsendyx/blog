
(function() {
	var $nav = $('#nav');
	var num = parseInt( $nav.data('active') );
	$nav.find('li').eq(num).addClass('active');

	$('#logout').click(function() {
		if( confirm('确定退出？') ) {
			get('/admin/logout', function() {
				window.location.href = '/admin';
			});
		}
	});
})();

function get(url, cb) {
	$.ajax({
		url: url
	})
	.done(function(data) {
		if( data.type === 'ok' ) return cb(data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function() {
		errXhr(http, text, err);
	});
}

function del(url, cb) {
	$.ajax({
		url: url,
		type: 'delete'
	})
	.done(function(data) {
		if( data.type === 'ok' ) return cb(data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function post(url, data, cb) {
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: data
	})
	.done(function(data) {
		if( data.type === 'ok' ) return cb(data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function filePost(url, data, cb) {
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: data,
		contentType: false,
		processData: false
	})
	.done(function(data) {
		if( data.type === 'ok' ) return cb(data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function errXhr(http, text, err) {
	if( http.status == 401 ) {
		window.location.href = '/admin';
	} else {
		var info = '';
		info += '获取数据出错，请稍后再试\n';
		info += '网络状态码：' + http.status + '\n';
		info += 'ajax状态码：' + http.readyState + '\n';
		info += '错误文本信息：' + text;
		console.log( info );
		alert( info );
	}
}

function splitNum( num ) {
	var orginNum = Math.floor(num / 10) * 10;
	var strNum = '' + num;
	var lastNum = parseInt( strNum.charAt( strNum.length-1 ) );

	if( lastNum < 3 ) {
		lastNum = 0;
	} else if( (lastNum <= 5 && lastNum >=3) || (lastNum < 7 && lastNum > 5) ) {
		lastNum = 5;
	} else if( lastNum >=7 ) {
		lastNum = 10;
	}
	return orginNum + lastNum;
}