
$(function() {
	var $title = $('#title');
	var $desc = $('#desc');
	var $file = $('#file');
	var $send = $('#send');

	$send.click(function() {
		console.log('a');
		var title = $title.val();
		var desc = $desc.val();
		var file = $file.val();
		if( !title ) return alert('请填写标题！');
		if( !desc ) return alert('请填写描述信息！');
		if( !file ) return alert('请选择demo文件！');

		var formData = new FormData();
		formData.append('title', title);
		formData.append('desc', desc);
		formData.append('file', $file.get(0).files[0]);

		filePost('/admin/update/demo', formData, function(data) {
			window.location.href = '/admin/demo/list';
		});
	});
});