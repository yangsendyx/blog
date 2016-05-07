
var $LOAD_BOX = $('#loading');

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
	showLoading();
	$.ajax({
		url: url
	})
	.done(function(data) {
		if( data.type === 'ok' ) return hideLoading(cb, data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function() {
		errXhr(http, text, err);
	});
}

function del(url, cb) {
	showLoading();
	$.ajax({
		url: url,
		type: 'delete'
	})
	.done(function(data) {
		if( data.type === 'ok' ) return hideLoading(cb, data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function post(url, data, cb) {
	showLoading();
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: data
	})
	.done(function(data) {
		if( data.type === 'ok' ) return hideLoading(cb, data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function filePost(url, data, cb) {
	showLoading();
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		data: data,
		contentType: false,
		processData: false
	})
	.done(function(data) {
		if( data.type === 'ok' ) return hideLoading(cb, data);
		console.log( data.info );
		alert(data.info);
	})
	.fail(function(http, text, err) {
		errXhr(http, text, err);
	});
}

function showLoading() {
	$LOAD_BOX.show().animate({opacity: 1}, 400, 'linear');
}

function hideLoading( cb, data ) {
	$LOAD_BOX.animate({opacity: 0}, 400, 'linear', function() {
		$(this).hide(0);
		if( cb ) {
			if( data ) return cb(data);
			cb();
		}
	});
}

function errXhr(http, text, err) {
	var cb = function(http, text, err) {
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
	};
	hideLoading( cb );
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

function madePaging(total, current, length, url) {
	var con = '';
	var run = function(max, min) {
		for( var i=min; i<max; i++ ) {
			if( i+1 == current ) {
				con += '<li class="active"><a href="#">'+(i+1)+'</a></li>';
			} else {
				con += '<li><a href="'+url+'?start='+(i*length)+'&length='+length+'">'+(i+1)+'</a></li>';
			}
		}
	};

	if( current == 1 ) {
		con = '<li class="disabled"><a href="#">首页</a></li>';
	} else {
		con = '<li><a href="'+url+'?start=0&length='+length+'">首页</a></li>';
	}

	if( total <= 5 ) {
		run(total, 0);
	} else {
		if( current < 3 ) {
			run(5, 0);
		} else if( current > total-2 ) {
			run(total, total-5);
		} else {
			con += '<li><a href="'+url+'?start='+((current-3)*length)+'&length='+length+'">'+(current-2)+'</a></li>';
			con += '<li><a href="'+url+'?start='+((current-2)*length)+'&length='+length+'">'+(current-1)+'</a></li>';
			con += '<li class="active"><a href="#">'+current+'</a></li>';
			con += '<li><a href="'+url+'?start='+(current*length)+'&length='+length+'">'+(current+1)+'</a></li>';
			con += '<li><a href="'+url+'?start='+((current+1)*length)+'&length='+length+'">'+(current+2)+'</a></li>';
		}
	}

	if( current == total ) {
		con += '<li class="disabled"><a href="#">尾页</a></li>';
	} else {
		con += '<li><a href="'+url+'?start='+((total-1)*length)+'&length='+length+'">尾页</a></li>';
	}

	return con;
}