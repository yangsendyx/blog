
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
}]);


ctrl.controller('ctrl-note-list', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
	$scope.data = {
		tags: ['全部','html', 'css', 'javascript', 'jquery', 'angular', 'node', 'express', 'nginx'],
		class: 0
	};

	/*$scope.tagFilter = function(name) {
		console.log(name);
	};*/
	$scope.startBo = false;
	$root.loadingBo = true;
	$timeout(function() {
		$scope.startBo = true;
		$root.loadingBo = false;
	}, 2000);
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


ctrl.controller('ctrl-demo', ['$scope', '$rootScope', '$timeout', function($scope, $root, $timeout){
	$scope.text = 'demo';
	$scope.startBo = false;
	$root.loadingBo = true;
	$timeout(function() {
		$scope.startBo = true;
		$root.loadingBo = false;
	}, 6000);
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
