$(function() {
	var opts = {
		basePath: '/js/admin/lib',
		file: {
			name: 'article',
			autoSave: 1000
		},
		theme: {
			editor: '/themes/editor/epic-dark.css',
			preview: '/themes/preview/github.css'
		}
	};

	var editor = new EpicEditor(opts);

	var $checkbox = $('#checkNewCategory');
	var $choiceType = $('#choiceType');
	var $radio = $choiceType.find('input[type="radio"]');
	var $newCategory = $('#newCategory');
	var $category = $('#category');
	var $pathText = $('#pathText');
	var dataArticle = $pathText.data('text');
	var $nameText = $('#nameText');
	var $clear = $('#clear');
	var $send = $('#send');
	var $epiceditor = $('#epiceditor');

	var categoryId = $category.data('select');
	if( categoryId ) $category.find('option[value="'+categoryId+'"]').prop('selected', true);

	$clear.click(function() {
		editor.importFile('article', '');
	});

	$(document).keydown(function(ev) {
		if( ev.keyCode == 9 ) {
			ev.preventDefault();
			$epiceditor.focus();
		}
	});

	$checkbox.change(function() {
		if( $(this).prop('checked') ) {
			$newCategory.show();
			$category.hide();
		} else {
			$newCategory.hide();
			$category.show();
		}
	});

	$radio.change(function() {
		var val = $(this).val();
		if( val == '转载' ) {
			$pathText.show(); $nameText.show();
		} else {
			$pathText.hide(); $nameText.hide();
		}
	});
	var choiceRadio = $choiceType.data('radio');
	$nameText.hide(); $pathText.hide();
	if( choiceRadio == '转载' ) $radio.eq(0).trigger('click');

	var $title = $('#title');

	editor.load(function() {
		if( dataArticle ) editor.importFile('article', dataArticle);
	});

	$send.click(function() {
		var title = $title.val();
		var category = $category.val();
		var newCateBo = false;
		var path = '';
		var name = '';
		var text = editor.exportFile('article', 'text');
		var con = editor.exportFile('article', 'html');
		var reg = /\r|\n|\#+|\!\[.+\]\(http.+\)/g;
		var reg2 = /\[(.+)\]\(http.+\)/g;
		var desc = text.replace(reg, '').replace(reg2, function($1, $2) {
			return '(' + $2 + ')';
		}).substr(0, 138);

		desc += '...';
		var article = '';
		var id = $pathText.data('id');

		if( !id ) id = '';
		var checkBo = $checkbox.prop('checked');
		if( checkBo ) {
			category = $newCategory.val();
			newCateBo = true;
		}
		var type = $choiceType.find('input:checked').val();
		if( type == '转载' ) {
			path = $pathText.find('input').val();
			name = $nameText.find('input').val();
			article += '<p class="avow">本文章转载自<a href="'+path+'"> '+name+' </a>，仅作为学习之用，但尚未征得原作者同意，若您觉得有任何不妥之处，请在评论中回复，并留下您的联系方式，我会在第一时间进行处理，谢谢！</p>';
		}
		article += con;

		if( !title ) return alert('请填写标题');
		if( !category ) return alert('请填写或选择分类');
		if( type == '转载' ) {
			if( !name ) return alert('请填写被转载者名称');
			if( !path ) return alert('请填写转载地址');
		}
		if( !text ) return alert('请填写文章内容');

		var data = {
			title: title,
			desc: desc,
			category: category,
			bo: newCateBo,
			type: type,
			name: name,
			path: path,
			article: article,
			text: text,
			id: id
		};

		post('/admin/update/article', data, function(data) {
			window.location.href = '/admin/article/list';
		});
	});
});