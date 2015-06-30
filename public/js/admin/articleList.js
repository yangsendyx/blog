$(function() {
	var $tbody = $('#tbody');

	$tbody.delegate('button.del', 'click', function(event) {
		var id = $(this).data('id');
		var $tr = $(this).parent().parent();
		del('/admin/article/list/del/'+id, function(data) {
			$tr.remove();
		});
	});
});