
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

var app = angular.module('app', ['ui.router', 'myService', 'myFilter', 'myDirective', 'myController']);

app.run(['$rootScope', function($rootScope) {
	$rootScope.pagename = '';
	$rootScope.oldPage = '';

	$rootScope.articleID = '';
	$rootScope.loadingBo = false;
	$rootScope.time = 1000;
	$rootScope.dialogMsg = '';
	$rootScope.dialogShow = false;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function($state, $url) {
	$url.otherwise('/').when('', '/');

	var tempDemo = '<div id="demo" page class="page">'+
						'<div class="pubul-wrap" pubuliu>'+
							'<section></section>'+
							'<section></section>'+
							'<section></section>'+
						'</div>'+
					'</div>';

	

	$state.state('index', {
		url: '/',
		templateUrl: 'views/index.html'
	}).state('note-list', {
		url: '/note-list',
		templateUrl: 'views/note-list.html',
		controller: 'ctrl-note-list'
	}).state('note', {
		url: '/note/:id',
		templateUrl: 'views/note.html',
		controller: 'ctrl-note'
	}).state('demo', {
		url: '/demo',
		template: tempDemo,
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

