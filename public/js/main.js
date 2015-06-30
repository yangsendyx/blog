
(function(){
	var vendors = ['webkit', 'moz'];
	for(var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
	}
})();

function randomNum(big, small) {
	var min = Math.min(big, small);
	var max = Math.max(big, small);
	return Math.random() * (max-min) + min;
}

var CLIENT_W = document.documentElement.clientWidth;
var CLIENT_H = document.documentElement.clientHeight;

var app = angular.module('app', ['ui.router', 'myService', 'myDirective', 'myController']);

app.run(['$rootScope', '$location', function($rootScope, $location) {
	var initPage = $location.path().substring(1);
	$rootScope.pagename = initPage;
	$rootScope.oldPage = initPage;
	$rootScope.loadingBo = false;
	$rootScope.time = 1000;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function($state, $url) {
	$url.otherwise('/').when('', '/');

	$state.state('index', {
		url: '/',
		templateUrl: 'views/index.html'
	}).state('note-list', {
		url: '/note-list',
		templateUrl: 'views/note-list.html',
		controller: 'ctrl-note-list'
	}).state('note', {
		url: '/note/{id: [a-zA-Z0-9]{12}}',
		templateUrl: 'views/note.html',
		controller: 'ctrl-note'
	}).state('demo', {
		url: '/demo',
		templateUrl: 'views/demo.html',
		controller: 'ctrl-demo'
	}).state('message', {
		url: '/message',
		templateUrl: 'views/message.html',
		controller: 'ctrl-message'
	}).state('about', {
		url: '/about',
		templateUrl: 'views/about.html',
		controller: 'ctrl-about'
	});
}]);

