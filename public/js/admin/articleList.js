$(function() {
	var $tbody = $('#tbody');
	var $paging = $('#pagination');
	var all = $paging.data('all');
	var cur = $paging.data('cur');

	$tbody.delegate('button.del', 'click', function(event) {
		var id = $(this).data('id');
		var $tr = $(this).parent().parent();
		del('/admin/article/list/del/'+id, function(data) {
			$tr.remove();
		});
	});

	$paging.html( madePaging(all, cur, 10, '/admin/article/list') );
});