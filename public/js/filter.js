
var filter = angular.module('myFilter', []);

filter.filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
	    return $sce.trustAsHtml(text);
	};
}]);


filter.filter('initTime', function() {
	return function (time) {
	    return changeTime(time);
	};
});

function changeTime(time) {
	var now = new Date(time);
	var str = now.getFullYear() + '-' + addZero(now.getMonth()+1) + '-' + addZero(now.getDate()) + ' ';
	str += addZero(now.getHours()) + ':' + addZero(now.getMinutes()) + ':' + addZero(now.getSeconds());
	return str;
}

function addZero(num) {
	if( num < 10 ) return '0' + num;
	return '' + num;
}