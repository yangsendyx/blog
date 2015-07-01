
var ctrl = angular.module('myController', []);

ctrl.controller('myCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
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

	$scope.login = false;
	$scope.fn = {
		login: function(str) {
			$scope.login = true;
		},
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


ctrl.controller('ctrl-message', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
	$scope.text = 'message';
	$scope.startBo = false;
	$root.loadingBo = true;
	$timeout(function() {
		$scope.startBo = true;
		$root.loadingBo = false;
	}, 2000);
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
