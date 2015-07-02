
var ctrl = angular.module('myController', []);

ctrl.controller('myCtrl', ['$scope', '$rootScope', '$timeout', 'ysHttp', function($scope, $root, $timeout, ajax){
	var toggleBo = true;
	var timer = null;
	$scope.toggle = function(name) {
		if( toggleBo ){
			toggleBo = false;
			$root.pagename = name;

			$timeout.cancel(timer);
			timer = $timeout(function() {
				toggleBo = true;
			}, 1600);
		}
	};

	$scope.loginBo = false;
	$scope.dialogBo = false;
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
		}
	};
}]);


ctrl.controller('ctrl-note-list', ['$scope', '$rootScope', 'ysHttp', function($scope, $root, ajax){
	$scope.data = {
		tags: ['全部','html', 'css', 'javascript', 'jquery', 'angular', 'node', 'express', 'nginx'],
		class: 0
	};

	/*$scope.tagFilter = function(name) {
		console.log(name);
	};*/

	$scope.startBo = true;
	/*$root.loadingBo = true;
	ajax.get('/test/api', function(data) {
		$scope.startBo = true;
		$root.loadingBo = false;
		console.log( data );
	});*/
}]);


ctrl.controller('ctrl-note', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
	$scope.text = 'note';
	$scope.startBo = false;
	$root.loadingBo = true;
	$timeout(function() {
		$scope.startBo = true;
		$root.loadingBo = false;
	}, 2000);
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


ctrl.controller('ctrl-message', ['$scope', '$rootScope', 'ysHttp',  function($scope, $root, ajax){
	$scope.startBo = true;
	$scope.msg.url = '/message/save';
	
	$scope.data = {};
	$scope.data.msgs = [];
	/*$scope.data.extendMsgs = [];
	var extendBo = true;*/
	$scope.ctrlOpenUlBo = false;
	$scope.getMsg = function( start, bo ) {
		ajax.get('/message/list?start='+start, function(data) {
			$scope.startBo = true;
			$scope.data.len = data.len;
			$scope.data.msgs = data.msgs;
			if( bo ) $scope.ctrlOpenUlBo = true;
		});
	};
	$scope.getMsg( 0 );

	/*$scope.extendData = function() {
		$scope.data.extendMsgs = angular.copy($scope.data.msgs, []);
		$scope.ctrlHeightBo = false;
	};*/

	
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
			if( !$scope.msg.info.id ) $scope.replyPageNum = 0;
			$scope.fn.confirm(true);
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
