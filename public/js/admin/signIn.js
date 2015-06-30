

$(function() {
	var clientH = $(window).height();
	var $form = $('form');
	var $user = $('#user-name');
	var $pass = $('#user-pass');
	$form.css({
		'marginTop': clientH/8,
		'box-shadow': '0 0 20px #555',
		'border-radius': '6px'
	});

	var userName = $.cookie('user');
	var password = $.cookie('pass');

	if( userName ) {
		$user.val( userName );
		$pass.val( password );
	}

	$('#singin').click(function() {
		var name = $user.val();
		var pass = $pass.val();

		if( name === '' ) return alert('用户名不能为空！');
		if( pass === '' ) return alert('密码不能为空！');

		if( $('#remember').prop('checked') ) {
			$.cookie('user', name, {expires: 30});
			$.cookie('pass', pass, {expires: 30});
		} else {
			$.cookie('user', null);
			$.cookie('pass', null);
		}
		var data = { name: name, pass: pass };
		post('/admin/login', data, function(data) {
			window.location.href = '/admin/home';
		});
	});
});