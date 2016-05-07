
$(function() {
	var $title = $('#modal-title');
	var $img = $('#modal-img');
	var $modalBox = $('#modalBox');
	var $tbody = $('#tbody');
	var $paging = $('#pagination');
	var all = $paging.data('all');
	var cur = $paging.data('cur');

	$tbody.delegate('button', 'click', function(event) {
		var className = $(this).attr('class');
		if( /dialogImg/g.test(className) ) {
			var path = $(this).data('path');
			var title = $(this).data('title');
			$title.html( title );
			$img.attr('src', path);
			$modalBox.modal('show');
		} else if( /del/g.test(className) ) {
			if( confirm('确定删除？') ) {
				var $tr = $(this).parent().parent();
				var id = $(this).data('id');
				del('/admin/demo/list/del/'+id, function(data) { $tr.remove(); });
			}
		}
	});

	$paging.html( madePaging(all, cur, 10, '/admin/demo/list') );
});