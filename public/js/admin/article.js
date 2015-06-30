$(function() {
	var ue = UE.getEditor('editor');
	var $checkbox = $('#checkNewCategory');
	var $choiceType = $('#choiceType');
	var $radio = $choiceType.find('input[type="radio"]');
	var $newCategory = $('#newCategory');
	var $category = $('#category');
	var $pathText = $('#pathText');
	var dataArticle = $pathText.data('article');
	var $nameText = $('#nameText');
	var $send = $('#send');

	var categoryId = $category.data('select');
	if( categoryId ) $category.find('option[value="'+categoryId+'"]').prop('selected', true);

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
	if( choiceRadio == '原创' ) $radio.eq(1).trigger('click');

	var $title = $('#title');
	var $desc = $('#desc');

	if( dataArticle ) {
		ue.addListener("ready", function () {
			ue.setContent( dataArticle );
		});
	}

	$send.click(function() {
		var title = $title.val();
		var desc = $desc.val();
		var category = $category.val();
		var newCateBo = false;
		var path = '';
		var name = '';
		var con = ue.getContent();
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
			article += '<p>本文章转载自<a href="'+path+'"> '+name+' </a>，作为学习之用，但尚未征得原作者同意，若您觉得有任何不妥之处，请在评论中回复，并留下您的联系方式，我会在第一时间进行处理，谢谢！</p>';
		}
		article += con;

		if( !title ) return alert('请填写标题');
		if( !desc ) return alert('请填写描述');
		if( !category ) return alert('请填写或选择分类');
		if( type == 'zhuan' ) {
			if( !name ) return alert('请填写被转载者名称');
			if( !path ) return alert('请填写转载地址');
		}
		if( !article ) return alert('请填写文章内容');

		var data = {
			title: title,
			desc: desc,
			category: category,
			bo: newCateBo,
			type: type,
			name: name,
			path: path,
			article: article,
			id: id
		};

		post('/admin/update/article', data, function(data) {
			window.location.href = '/admin/article/list';
		});
	});
});