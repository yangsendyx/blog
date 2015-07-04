
var ctrl = angular.module('myController', []);

ctrl.controller('myCtrl', ['$scope', '$rootScope', '$timeout', '$location', 'ysHttp', function($scope, $root, $timeout, $location, ajax){
	var toggleBo = true;
	var timer = null;
	$scope.toggle = function(name, id) {
		var url = $location.path();
		var arr = url.split('/');
		var initPage = arr[arr.length-1];
		if( url.indexOf('note/') != -1 ) initPage = arr[arr.length-2];

		if( toggleBo && name != initPage ){
			toggleBo = false;
			$root.pagename = name;
			if( id ) $root.articleID = id;
			$timeout.cancel(timer);
			timer = $timeout(function() {
				toggleBo = true;
			}, 1600);
		}
	};

	$scope.loginBo = false;
	$scope.dialogBo = false;
	// localStorage.removeItem('info');
	var info = localStorage.getItem('info');
	var name = '';
	var qq = '';

	if( info ) {
		info = angular.fromJson( info );
		name = info.name;
		qq = info.qq;
	}
	$scope.msg = { nk: name, qq: qq, dialog: '', url: '', info: { msg: '', from: '', to: '', id: '' } };
	$scope.watchData = { msg: 0, article: 0 };
	$scope.fn = {
		hideLogin: function() {
			$scope.loginBo = false;
		},
		showLogin: function() {
			$scope.loginBo = true;
		},
		showDialog: function(msg) {
			$scope.msg.dialog = msg;
			$scope.dialogBo = true;
		},
		confirm: function(bo) {
			if( !bo ) {
				if( !$scope.msg.nk ) {
					this.showDialog('亲，至少留个昵称呗 ^_^');
					return;
				} else if( this.checkLen($scope.msg.nk) ) {
					$scope.msg.nk = '';
					this.showDialog('亲，昵称太长了哦，中文最多6位，英文最多12位。<br>咱昵称就改短点呗 ^_^');
					return;
				} else {
					var json = { name: $scope.msg.nk, qq: $scope.msg.qq };
					localStorage.setItem('info', angular.toJson( json ) );
				}
			}
			var data = {
				from: $scope.msg.nk,
				qq: $scope.msg.qq,
				msg: $scope.msg.info.msg,
				to: $scope.msg.info.to,
				id: $scope.msg.info.id
			};

			ajax.post($scope.msg.url, data, function(data) {
				$scope.msg.info.msg = '';
				$scope.msg.info.from = '';
				$scope.msg.info.to = '';
				$scope.msg.info.id = '';

				if( /message/g.test($scope.msg.url) ) {
					$scope.watchData.msg++;
				} else if( /article/g.test($scope.msg.url) ) {
					$scope.watchData.article++;
				}
				if( !bo ) $scope.fn.hideLogin();
			});
		},
		checkLen: function(val) {
			var len = 0;
			for (var i = 0; i < val.length; i++) {
				if (val[i].match(/[^\x00-\xff]/ig) !== null) // 全角
					len += 2;
				else
					len += 1;
			}
			return len > 12 ? true: false;
		}
	};

	$scope.$on('$locationChangeSuccess', function(ev, newVal, oldVal) {
		var arr = newVal.split('/');
		var val = arr[arr.length-1];
		if( newVal.indexOf('note/') != -1 ) {
			val = arr[arr.length-2];
		}
		$root.pagename = newVal;
		$root.oldPage = newVal;
	});
}]);


ctrl.controller('ctrl-note-list', ['$scope', '$rootScope', 'ysHttp', function($scope, $root, ajax){
	$scope.startBo = false;
	$scope.data = {};
	$scope.data.type = 'all';
	$scope.data.category = [];
	$scope.data.article = {};
	$scope.data.category.push({ _id: 'all', name: '全部', active: true });
	var count = 0;
	$scope.getCategory = function() {
		ajax.get('/article/category', function(data) {
			count++; if( count == 2 ) $scope.startBo = true;
			data = data.data;
			var len = data.length;
			var length = 0;
			for( var i=0; i<len; i++ ) {
				data[i].artive = false;
				length += parseInt( data[i].length );
				$scope.data.category.push( data[i] );
			}
			$scope.data.category[0].length = length;
		});
	};

	$scope.getArticle = function( page, bo, cb ) {
		page = parseInt( page );
		var start = (page-1) * 9;
		var url = '/article/list?start='+start+'&type='+$scope.data.type;
		document.documentElement.scrollTop = document.body.scrollTop = 0;
		ajax.get(url, function(data) {
			count++; if( count == 2 ) $scope.startBo = true;
			var all = Math.ceil(parseInt(data.length) / 9);
			var current = page;
			$scope.data.paging = makePaging(all, current);

			var arr = [];
			var len = data.data.length;
			for(var i=0; i<len; i++) arr.push( data.data[i] );
			$scope.data.list = arr;
			if( bo ) $scope.data.opacitBo = false;
			if( cb ) cb();
		});
	};
	$scope.getCategory();
	$scope.getArticle(1);
	$scope.data.opacitBo = false;

	$scope.fnpaging = function( page ) {
		page = parseInt(page);
		$scope.data.opacitBo = true;
		setTimeout(function() {
			$scope.getArticle(page, true);
		}, 400);
	};

	$scope.tagFilter = function(obj) {
		if( obj._id != $scope.data.type ) {
			$scope.data.type = obj._id;
			$scope.data.opacitBo = true;
			setTimeout(function() {
				$scope.getArticle(1, true, function() {
					var len = $scope.data.category.length;
					for( var i=0; i<len; i++ ) {
						$scope.data.category[i].active = false;
						if( $scope.data.category[i]._id == $scope.data.type ) {
							$scope.data.category[i].active = true;
						}
					}
				});
			}, 400);
		}
	};
}]);



ctrl.controller('ctrl-note', ['$scope', '$rootScope', '$stateParams', 'ysHttp', function($scope, $root, $stateParams, ajax){
	$scope.data = {};
	$scope.startBo = false;
	$scope.data.id = $stateParams.id;
	$scope.msg.url = '/article/comment/save/'+$scope.data.id;
	$scope.msg.info.msg = '';
	$scope.data.autoFocus = false;
	$scope.data.texareaT = 0;
	
	var count = 0;
	$scope.getArticle = function() {
		ajax.get('/article/'+$scope.data.id, function(data) {
			count++; if( count === 2 ) $scope.startBo = true;
			$scope.data.article = data.data;
		});
	};
	$scope.getReply = function() {
		ajax.get('/article/comment/'+$scope.data.id, function(data) {
			count++; if( count === 2 ) $scope.startBo = true;
			$scope.data.reply = data.data;
		});
	};
	$scope.getReply();
	$scope.getArticle();

	$scope.subMsg = function() {
		if( !$scope.msg.info.msg ) return $scope.fn.showDialog('亲，至少输入点啥呗！');
		if( !$scope.msg.nk ) {
			$scope.fn.showLogin();
		} else {
			$scope.fn.confirm(true);
		}
	};

	$scope.fnComment = function(to, id) {
		var t = document.documentElement.scrollTop || document.body.scrollTop;
		if( t > $scope.data.texareaT ) {
			document.documentElement.scrollTop = document.body.scrollTop = $scope.data.texareaT;
		}
		$scope.data.autoFocus = true;
		$scope.msg.info.to = to;
		$scope.msg.info.id = id;
	};

	$scope.fnBlur = function() {
		$scope.data.autoFocus = false;
	};

	$scope.hideBtn = function() {
		$scope.msg.info.to = '';
		$scope.msg.info.id = '';
	};

	$scope.$watch('watchData.article', function(newVal) {
		if( newVal ) $scope.getReply();
	});
}]);


ctrl.controller('ctrl-demo', ['$scope', '$rootScope', 'ysHttp', function($scope, $root, ajax){
	$scope.startBo = false;

	$scope.data = {};
	$scope.data.nowLen = 0;
	$scope.data.httpBo = true;

	$scope.fnHttp = function(start) {
		var url = '/demo/list?start=' + start;
		ajax.get(url, function(data) {
			$scope.startBo = true;
			$scope.data.length = data.length;
			$scope.data.demos = data.data;
			$scope.data.nowLen += data.data.length;
			$scope.data.httpBo = true;
		});
	};
	$scope.fnHttp(0);
}]);


function makePaging(all, current) {
	var arr = [];
	var loop = function(min, max) {
		for( var i=min; i<max; i++ ) {
			var json, active = false;
			if( (i+1) == current ) active = true;
			json = { text: (i+1), page: (i+1), active: active };
			arr.push( json );
		}
	};

	if( all <= 5 ) {
		loop( 0, all );
	} else {
		if( current != 1 ) {
			arr.push({ text: '首页', page: 1, active: false });
			arr.push({ text: '上一页', page: (current-1), active: false });
		}

		if( current < 3 ) {
			loop( 0, 5 );
		} else if( current > all-2 ) {
			loop( all-5, all );
		} else {
			arr.push({ text: (current-2), page: (current-2), active: false });
			arr.push({ text: (current-1), page: (current-1), active: false });
			arr.push({ text: current, page: current, active: true });
			arr.push({ text: (current+1), page: (current+1), active: false });
			arr.push({ text: (current+2), page: (current+2), active: false });
		}

		if( current != all ) {
			arr.push({ text: '下一页', page: (current+1), active: false });
			arr.push({ text: '尾页', page: all, active: false });
		}
	}
	return arr;
}


ctrl.controller('ctrl-message', ['$scope', '$rootScope', 'ysHttp',  function($scope, $root, ajax){
	$scope.startBo = true;
	$scope.msg.url = '/message/save';
	$scope.msg.info.msg = '';
	
	$scope.data = {};
	$scope.data.msgs = [];
	$scope.ctrlOpenUlBo = false;
	$scope.replyPageNum = 1;
	$scope.getMsg = function( start, bo ) {
		start = parseInt(start);
		var start2 = (start -1) * 6;
		ajax.get('/message/list?start='+start2, function(data) {
			$scope.startBo = true;
			$scope.data.len = data.length;
			$scope.data.msgs = data.msgs;
			var all = Math.ceil(data.length / 6);
			var current = start2 / 6 + 1;
			$scope.data.currentPage = current;
			$scope.data.paging = makePaging( all, current );
			if( bo ) $scope.ctrlOpenUlBo = true;
		});
	};
	$scope.getMsg( 1 );
	
	$scope.autoFocus = true;
	$scope.comment = function(to, id) {
		document.documentElement.scrollTop = document.body.scrollTop = 0;
		$scope.autoFocus = true;
		$scope.msg.info.to = to;
		$scope.msg.info.id = id;
	};

	$scope.fnBlur = function() {
		$scope.autoFocus = false;
	};

	$scope.hideBtn = function() {
		$scope.msg.info.to = '';
		$scope.msg.info.id = '';
	};

	$scope.subMsg = function() {
		if( !$scope.msg.info.msg ) return $scope.fn.showDialog('亲，至少输入点啥呗！');
		if( !$scope.msg.nk ) {
			$scope.fn.showLogin();
		} else {
			if( !$scope.msg.info.id ) $scope.replyPageNum = 1;
			$scope.fn.confirm(true);
		}
	};

	$scope.fnPaging = function(page) {
		page = parseInt( page );
		if( page != $scope.data.currentPage ) {
			$scope.replyPageNum = page;
			$scope.ctrlHeightBo = true;
		}
	};

	$scope.ctrlHeightBo = false;
	$scope.$watch('watchData.msg', function(newVal) {
		if( newVal ) $scope.ctrlHeightBo = true;
	});
}]);


ctrl.controller('ctrl-about', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
	$scope.text = 'about';
	$scope.startBo = false;
	$root.loadingBo = true;
	$timeout(function() {
		$scope.startBo = true;
		$root.loadingBo = false;
	}, 2000);
}]);
