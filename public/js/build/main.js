var service = angular.module('myService', []);

service.factory('ysAnimate', function() {
	return {
		tween:{
			linear: function (t, b, c, d){return c*t/d + b;},
			easeIn: function(t, b, c, d){return c*(t/=d)*t + b;},
			easeOut: function(t, b, c, d){return -c *(t/=d)*(t-2) + b;},
			easeBoth: function(t, b, c, d){  
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInStrong: function(t, b, c, d){return c*(t/=d)*t*t*t + b;},
			easeOutStrong: function(t, b, c, d){return -c * ((t=t/d-1)*t*t*t - 1) + b;},
			easeBothStrong: function(t, b, c, d){  
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			elasticIn: function(t, b, c, d, a, p){
				var s;
				if (t === 0) return b; 
				if ( (t /= d) == 1 )return b+c; 
				if (!p) p=d*0.4; //弹性幅度
				if (!a || a < Math.abs(c)) {
					a = c; s = p/4;
				} else {
					s = p/(2*Math.PI) * Math.asin (c/a);
				}
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			elasticOut: function(t, b, c, d, a, p){
				var s;
				if (t === 0) return b;
				if ( (t /= d) == 1 ) return b+c;
				if (!p) p=d*0.4;//弹性幅度
				if (!a || a < Math.abs(c)) {
					a = c; s = p / 4;
				} else {
					s = p/(2*Math.PI) * Math.asin (c/a);
				}
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			elasticBoth: function(t, b, c, d, a, p){
				var s;
				if (t === 0) return b;
				if ( (t /= d/2) == 2 ) return b+c;
				if (!p) p = d*(0.3*1.5);//弹性幅度
				if ( !a || a < Math.abs(c) ) {
					a = c; s = p/4;
				}else {
					s = p/(2*Math.PI) * Math.asin (c/a);
				}
				if (t < 1) return - 0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
			},
			backIn: function(t, b, c, d, s){
				if (typeof s == 'undefined') s = 1.70158;//回缩的距离
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			backOut: function(t, b, c, d, s){
				if (typeof s == 'undefined') s = 1.70158; //回缩的距离 
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			}, 
			backBoth: function(t, b, c, d, s){
				if (typeof s == 'undefined') s = 1.70158; //回缩的距离
				if ((t /= d/2 ) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			bounceIn: function(t, b, c, d){
				return c - this.bounceOut(d-t, 0, c, d) + b;
			}, 
			bounceOut: function(t, b, c, d){
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
				}
				return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
			},
			bounceBoth: function(t, b, c, d){
				if (t < d/2) return this.bounceIn(t*2, 0, c, d) * 0.5 + b;
				return this.bounceOut(t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
			}
		},
		move: function( ngObj, opt ) {
			var json = opt.target;
			var time = opt.time || 400;
			var fx = opt.fx || 'linear';
			var fn = opt.fn || null;
			
			var This = ngObj;
			var ngService = this;
			var timeoutBo = true;
			if( window.requestAnimationFrame ) timeoutBo = false;

			var iCur = {};
			for(var attr in json){
				var val = parseInt( This.css(attr) );
				if( !angular.isNumber(val) || isNaN( val ) ){
					if( attr == 'left' ) {
						val = This[0].offsetLeft;
					} else if( attr == 'top' ) {
						val = This[0].offsetTop;
					} else if( attr == 'opacity' ) {
						val = parseInt(getComputedStyle(This[0], null).opacity * 10) / 10;
					}else {
						console.log( This.css(attr) + '|' + attr );
						console.log('元素的 '+attr+' 值不合法，请先设置元素的 '+attr+' 值!');
						return;
					}
				}
				iCur[attr] = val;
			}


			var startTime = new Date().getTime();

			var run = function(){
				var nowTime = new Date().getTime();
				var t = time - Math.max(0, startTime-nowTime+time);
				for(var attr in json){
					
					var value = ngService.tween[fx](t, iCur[attr], json[attr]-iCur[attr], time);
					if( attr == 'opacity' ){
						This.css(attr, value);
					}else{
						This.css(attr, value + 'px');
					}
				}

				if( t != time ){
					if( timeoutBo ){
						This.prop( 'animateTimer', setTimeout(run, 16.7) );
					}else{
						This.prop( 'animateTimer', requestAnimationFrame(run) );
					}
				}else{
					if( fn ) fn();
				}
			};
			
			if( timeoutBo ){
				clearTimeout( This.prop('animateTimer') );
			}else{
				cancelAnimationFrame( This.prop('animateTimer') );
			}
			
			run();
		},
		transform: function(ngObj, opt) {
			var json = opt.target;
			var time = opt.time || 400;
			var fx = opt.fx || 'linear';
			var fn = opt.fn || null;

			var This = ngObj;
			var ngService = this;
			var timeoutBo = true;
			if( window.requestAnimationFrame ) timeoutBo = false;

			var transform = This.css('-webkit-transform') || This.css('-moz-transform') || This.css('-ms-transform')  || This.css('-o-transform')  || This.css('transform');
			var transOrigin = This.css('-webkit-transform-origin') || This.css('-moz-transform-origin') || This.css('-ms-transform-origin')  || This.css('-o-transform-origin')  || This.css('transform-origin');
			var iCur = {rotate: 0, translate:[0,0], scale: [1,1], skew: [0,0], origin: ['50%','50%']};
			if( transOrigin ) {
				var orginVals = transOrigin.split(' ');
				iCur.origin = [orginVals[0], orginVals[1]];
			}

			if( transform ) {
				var values = transform.split(') ');
				var len = values.length;

				for( var i=0; i<len; i++ ) {
					var splitArr = values[i].split('(');
					var attr = splitArr[0];
					var val;
					if( attr == 'rotate' ) {
						val = parseFloat( splitArr[1] );
					} else {
						var vals = splitArr[1].split(',');
						val = [parseFloat(vals[0]), parseFloat(vals[1])];
					}
					iCur[attr] = val;
				}
			}
			
			angular.forEach(iCur, function(value, key){
				if( !json[key] && json[key] !== 0 ) json[key] = iCur[key];
			});
			
			iCur.origin = json.origin || ['50%', '50%'];
			var origin = iCur.origin[0] + ' ' + iCur.origin[1];
			
			var startTime = new Date().getTime();
			var run = function() {
				var nowTime = new Date().getTime();
				var t = time - Math.max(0, startTime - nowTime + time);
				var value = [];
				var x, y;

				var rotate = ngService.tween[fx](t, iCur.rotate, json.rotate-iCur.rotate, time);
				value.push('rotate('+rotate+'deg)');

				x = ngService.tween[fx](t, iCur.translate[0], json.translate[0]-iCur.translate[0], time);
				y = ngService.tween[fx](t, iCur.translate[1], json.translate[1]-iCur.translate[1], time);
				value.push('translate('+x+'px,'+y+'px)');

				x = ngService.tween[fx](t, iCur.scale[0], json.scale[0]-iCur.scale[0], time);
				y = ngService.tween[fx](t, iCur.scale[1], json.scale[1]-iCur.scale[1], time);
				value.push('scale('+x+','+y+')');

				x = ngService.tween[fx](t, iCur.skew[0], json.skew[0]-iCur.skew[0], time);
				y = ngService.tween[fx](t, iCur.skew[1], json.skew[1]-iCur.skew[1], time);
				value.push('skew('+x+'deg,'+y+'deg)');
				
				value = value.join(' ');
				
				This.css({ '-webkit-transform': value, '-moz-transform': value, '-ms-transform': value, '-o-transform': value, 'transform': value });
				This.css({ '-webkit-transform-origin': origin, '-moz-transform-origin': origin, '-ms-transform-origin': origin, '-o-transform-origin': origin, 'transform-origin': origin });

				if( t != time ){
					if( timeoutBo ) {
						This.prop( 'transormTimer', setTimeout(run, 16.7) );
					} else {
						This.prop( 'transormTimer', requestAnimationFrame(run) );
					}
				}else{
					if( fn ) fn();
				}
			};

			if( timeoutBo ) {
				clearTimeout( This.prop('transormTimer') );
			} else {
				cancelAnimationFrame( This.prop('transormTimer') );
			}
			run();
		}
	};
});


service.factory('ysHttp', ['$rootScope', '$http', function($root, $http) {
	var time;
	return {
		before: function() {
			$root.loadingBo = true;
			time = new Date().getTime();
		},
		after: function( cb ) {
			var dif = new Date().getTime() - time;
			var outTime = 0;
			if( dif < 300 ) outTime = 300 - dif;
			
			setTimeout(function(){
				$root.loadingBo = false;
				if( cb ) setTimeout(cb, 300);
			}, outTime);
		},
		get: function(url, cb) {
			var This = this;
			This.before();
			$http.get(url).success(function(data) {
				This.success(data, cb);
			}).error(function(data) {
				This.error( data );
			});
		},
		post: function(url, data, cb) {
			var This = this;
			This.before();
			$http.post(url, data).success(function(data) {
				This.success(data, cb);
			}).error(function(data) {
				This.error( data );
			});
		},

		success: function(data, cb) {
			this.after(function() {
				if( data.type == 'ok' ) return cb( data );

				if( /read/.test(data.info) ) {
					$root.dialogShow = true;
					$root.dialogMsg = '服务端读取数据失败<br>请稍后再行尝试！';
				} else if( /save/.test(data.info) ) {
					$root.dialogShow = true;
					$root.dialogMsg = '服务端存储数据失败<br>请稍后再行尝试！';
				} else {
					$root.dialogShow = true;
					$root.dialogMsg = '服务器错误：' + data.info;
				}
			});
		},
		error: function(data) {
			this.after();
			$root.dialogShow = true;
			$root.dialogMsg = '与服务器通信失败，请稍后再行尝试<br>或者您也可以直接联系管理员，谢谢！';
		}
	};
}]);;
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
};
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

	$scope.$watch('dialogShow', function(newVal) {
		if( newVal ) {
			$scope.fn.showDialog( $root.dialogMsg );
			$scope.dialogShow = false;
		}
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
			$scope.data.curPage = page;
			$scope.data.paging = makePaging(all, page);

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
		if( page != $scope.data.curPage ) {
			$scope.getArticle(page, true);
			$scope.data.opacitBo = true;
		}
	};

	$scope.tagFilter = function(obj) {
		if( obj._id != $scope.data.type ) {
			$scope.data.type = obj._id;
			$scope.data.opacitBo = true;
			$scope.getArticle(1, true, function() {
				var len = $scope.data.category.length;
				for( var i=0; i<len; i++ ) {
					$scope.data.category[i].active = false;
					if( $scope.data.category[i]._id == $scope.data.type ) {
						$scope.data.category[i].active = true;
					}
				}
			});
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
	$scope.startBo = false;
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
	$scope.startBo = true;
	
}]);
;
function Canvas(ctx, w, h) {
	this.ctx = ctx;
	this.clientW = w;
	this.clientH = h;
}

Canvas.prototype = {
	constructor: Canvas,
	bgdsArr: [[105, 206, 250], [126, 253, 216], [195, 126, 253], [253, 198, 126], [254, 150, 182]],
	bords: [],
	bgds: [105, 206, 250],
	origBgds: [105, 206, 250],
	bgdCount: 0,
	animateCount: 0,
	bgdNum: 0,
	bo: true,
	randomBo: true,

	init: function() {
		var count = 0;
		var This = this;
		if( !requestAnimationFrame ) this.bo = false;
		this.initFn();

		var run = function() {
			count++;
			if( count <= 23 ) {
				This.addBords();
				setTimeout(run, 150);
			}
		};
		run();
	},

	initFn: function() {
		this.drawCanvas();
		var This = this;
		if( !this.bo ) return setTimeout(function() {
			　This.initFn.call(This);
		}, 16.7);
		requestAnimationFrame(function() {
			　This.initFn.call(This);
		});
	},

	drawCanvas: function() {
		this.ctx.clearRect(0, 0, this.clientW, this.clientH);
		var i;
		var len = this.bords.length;
		this.drawBgd();

		for( i=0; i<len; i++ ) {
			var r = this.bords[i].r;
			var x = this.bords[i].x;
			var y = this.bords[i].y;
			var type = this.bords[i].type;

			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, Math.PI*2);
			this.ctx.closePath();

			//var grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
			var grd = this.ctx.createRadialGradient(x, y, 0, x, y, r*1.8);
			grd.addColorStop(0, this.bords[i].c1);
			grd.addColorStop(1, this.bords[i].c2);
			this.ctx.fillStyle = grd;
			this.ctx.fill();

			this.ctx.restore();
		}
		this.updateBords();
	},

	changeBgd: function() {
		var animateFram = 60;
		var target, dif;
		var bo = true;
		this.animateCount++;
		if( this.randomBo ) {
			this.bgdNum++;
			this.bgdNum %= this.bgdsArr.length;
		}
		for( var i=0; i<3; i++ ) {
			target = this.bgdsArr[this.bgdNum][i];
			dif = ( target - this.origBgds[i] ) / animateFram;
			this.bgds[i] = Math.round( this.bgds[i] + dif );
		}
		if( this.animateCount === animateFram ) {
			this.bgdCount = 0;
			this.randomBo = true;
			this.animateCount = 0;
			for( i=0; i<3; i++ ) this.origBgds[i] = this.bgdsArr[this.bgdNum][i];
		}
	},

	drawBgd: function() {
		this.bgdCount++;
		changeBgdTime = 1200;
		if( this.bgdCount >= changeBgdTime ) {
			if( this.bgdCount !== changeBgdTime ) this.randomBo = false;
			this.changeBgd();
		}
		var halfW = this.clientW / 2;
		this.ctx.save();
		var grd = this.ctx.createRadialGradient(halfW, this.clientH, 0, halfW, this.clientH, this.clientW*0.7);
		grd.addColorStop(0, 'rgb('+this.bgds[0]+','+this.bgds[1]+','+this.bgds[2]+')');
		grd.addColorStop(1, 'black');
		this.ctx.fillStyle = grd;
		this.ctx.fillRect(0, 0, this.clientW, this.clientH);
		this.ctx.restore();
	},

	addBords: function() {
		var r, g, b, a;
		var json = {};

		json.r = Math.random()*30 + 50;
		json.x = -json.r;
		json.y = this.clientH + json.r;
		json.vx = Math.random()*30 + 10;
		json.vy = -(Math.random()*30 + 10);
		r = Math.floor( randomNum(165, 255) );
		g = Math.floor( randomNum(165, 255) );
		b = Math.floor( randomNum(165, 255) );
		a = randomNum(0.5, 0.7);
		json.c1 = 'rgba('+r+','+g+','+b+','+a+')';
		r = Math.floor( randomNum(50, 150) );
		g = Math.floor( randomNum(50, 150) );
		b = Math.floor( randomNum(50, 150) );
		a = randomNum(0.5, 0.7);
		json.c2 = 'rgba('+r+','+g+','+b+','+a+')';
		json.decay = parseInt( randomNum(100, 120) );
		json.sx = parseInt(randomNum(0.97, 0.98) * 100) / 100;
		json.sy = parseInt(randomNum(0.97, 0.98) * 100) / 100;

		this.bords.push(json);
	},

	updateBords: function() {
		var len = this.bords.length;
		var i;
		for( i=0; i<len; i++ ) {
			this.bords[i].decay--;
			this.bords[i].x += this.bords[i].vx;
			this.bords[i].y += this.bords[i].vy;

			if( this.bords[i].decay > 0 ) {
				this.bords[i].vx *= this.bords[i].sx;
				this.bords[i].vy *= this.bords[i].sy;
			}

			if( this.bords[i].x < this.bords[i].r ){
				this.bords[i].x = this.bords[i].r;
				this.bords[i].vx = -this.bords[i].vx;
			} else if(this.bords[i].x > this.clientW - this.bords[i].r) {
				this.bords[i].x = this.clientW - this.bords[i].r;
				this.bords[i].vx = -this.bords[i].vx;
			}

			if( this.bords[i].y < this.bords[i].r ) {
				this.bords[i].y = this.bords[i].r;
				this.bords[i].vy = -this.bords[i].vy;
			} else if( this.bords[i].y > this.clientH - this.bords[i].r ) {
				this.bords[i].y = this.clientH - this.bords[i].r;
				this.bords[i].vy = -this.bords[i].vy;
			}
		}
	}
};

var direc = angular.module('myDirective', []);

direc.directive('delay', ['ysAnimate',  function(ysA){
	return {
		link: function($scope, iElm, iAttrs) {
			var clientW = CLIENT_W;
			var clientH = CLIENT_H+10;
			var can = document.getElementById('canvas');
			can.width = clientW;
			can.height = clientH;
			var ctx = can.getContext('2d');

			var canvas = new Canvas(ctx, clientW, clientH);
			canvas.drawBgd();

			var opt = {
				target: { opacity: 1 },
				time: 400,
				fn: function() {
					canvas.init.call(canvas);
				}
			};
			ysA.move(iElm, opt);
		}
	};
}]);


direc.directive('index', ['$timeout', '$state', '$rootScope', 'ysAnimate', function($timeout, $state, $root, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			iElm.css('height', (CLIENT_H - 50) + 'px');
			var section = iElm.find('section');
			var len = section.length;
			
			var arr = [[-600, -500], [600, -400], [600, 500], [-700, 400]];
			for( var i=0; i<len; i++ ) {
				angular.element(section[i]).css({
					'-webkit-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-moz-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-ms-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-o-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'opacity': 0
				});
			}

			var nav = document.getElementById('nav');
			angular.element( nav ).css( 'opacity', 0 );

			$timeout(function() {
				document.documentElement.scrollTop = document.body.scrollTop = 0;
				for( i=0; i<len; i++ ) {
					animate.transform( angular.element(section[i]), {target: { translate: [0, 0]}, time: 800, fx: 'easeOutStrong'});
					animate.move(angular.element(section[i]), {target: {opacity: 1}, time: 800});
				}
				$root.time = 10;
			}, $root.time);

			$scope.$watch('pagename', function(newValue, oldValue, scope) {
				if( newValue != $root.oldPage ) {
					var fn = function() {
						$root.oldPage = newValue;
						$state.go(newValue);
					};
					for( i=0; i<len; i++ ) {
						animate.transform( angular.element(section[i]), {target: { translate: arr[i]}, time: 1500, fx: 'easeOutStrong'});
						if( i == len -1 ) {
							animate.move(angular.element(section[i]), {target: {opacity: 0}, time: 800,
							fn: fn});
						} else {
							animate.move(angular.element(section[i]), {target: {opacity: 0}, time: 800});
						}
					}
				}
			});
		}
	};
}]);


direc.directive('page', ['$timeout', '$state', '$rootScope', '$window', 'ysAnimate', function($timeout, $state, $root, $window, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var distance = 400;
			var tag = iElm.next('div');
			
			iElm.css({
				'-webkit-transform': 'translate('+(-distance)+'px, 0px)',
				'-moz-transform': 'translate('+(-distance)+'px, 0px)',
				'-ms-transform': 'translate('+(-distance)+'px, 0px)',
				'-o-transform': 'translate('+(-distance)+'px, 0px)',
				'transform': 'translate('+(-distance)+'px, 0px)',
				'opacity': 0
			});

			var nav = document.getElementById('nav');
			angular.element( nav ).css( 'opacity', 1 );

			$scope.$watch('pagename', function(newValue, oldValue, scope) {
				if( newValue != $root.oldPage ) {
					animate.transform( iElm, {target: { translate: [distance, 0]}, time: 700, fx: 'easeOutStrong'});
					animate.move(iElm, {target: {opacity: 0}, time: 500});
					if( tag.length ) {
						animate.transform( tag, {target: { translate: [0, -300]}, time: 700, fx: 'easeOutStrong'});
						animate.move(tag, {target: {opacity: 0}, time: 700});
					}
					
					if( /demo/g.test($root.oldPage) || /note-list/g.test($root.oldPage) ) {
						angular.element($window).unbind('scroll');
					}

					$timeout(function() {
						$root.oldPage = newValue;
						if( /^note$/.test(newValue) ) {
							$state.go(newValue, {'id': $root.articleID});
						} else {
							$state.go(newValue);
						}
					}, 700);
				}
			});

			$scope.$watch('startBo', function(newValue, oldValue, scope) {
				if( newValue ) {
					$timeout(function() {
						document.documentElement.scrollTop = document.body.scrollTop = 0;
						animate.transform( iElm, {target: { translate: [0, 0]}, time: 800, fx: 'backOut'});
						animate.move(iElm, {target: {opacity: 1}, time: 800});
						$root.time = 10;
						if( tag.length ) {
							var opacityVal = 1;
							var l = iElm[0].offsetLeft - 5 - tag[0].offsetWidth;
							if( l < 0 ) opacityVal = 0;
							tag.css({
								'left': l + 'px', opacity: 0,
								'-webkit-transform': 'translate(0px, -300px)',
								'-moz-transform': 'translate(0px, -300px)',
								'-ms-transform': 'translate(0px, -300px)',
								'-o-transform': 'translate(0px, -300px)',
								'transform': 'translate(0px, -300px)'
							});
							animate.transform( tag, {target: { translate: [0, 0]}, time: 800, fx: 'backOut'});
							animate.move(tag, {target: {opacity: opacityVal}, time: 800});
						}
					}, $root.time);
				}
			});
		}
	};
}]);


direc.directive('nav', ['$rootScope', function($root){
	return {
		link: function($scope, iElm, iAttrs) {
			var li = iElm.find('li');
			var run = function(str) {
				for( var i=0; i<li.length; i++ ) {
					angular.element(li[i]).removeClass('active');
				}
				if( str == '/' || str == 'index' || str === '' ) {
					angular.element(li[0]).addClass('active');
				} else if( /note/g.test(str) ) {
					angular.element(li[1]).addClass('active');
				} else if( str == 'demo' ) {
					angular.element(li[2]).addClass('active');
				} else if( str == 'message' ) {
					angular.element(li[3]).addClass('active');
				} else if( str == 'about' ) {
					angular.element(li[4]).addClass('active');
				}
			};
			run( $root.pagename );

			$root.$on('$locationChangeStart', function(event, newUrl) {
				var newArr = newUrl.split('/');
				var newSate = newArr[newArr.length-1] || 'index';
				if( newUrl.indexOf('note/') != -1 ) {
					newSate = newArr[newArr.length-2];
				}
				run( newSate );
			});
		}
	};
}]);


direc.directive('loading', [ '$interval', 'ysAnimate', function($interval, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var elm = iElm.find('div');
			iElm.css({'opacity': 0, 'top': (CLIENT_H-240) / 2 + 'px'});
			var timer, time;
			$scope.$watch('loadingBo', function(newValue, oldValue, scope) {
				if( newValue != oldValue ) {
					if( newValue ) return Loading.show();
					Loading.hide();
				}
			});

			var Loading = {
				show: function() {
					time = new Date().getTime();
					iElm.css('display', 'block');
					animate.move(iElm, { target: {opacity: 1}, time: 300 });
					// iElm.css('opacity', 1);
					this.run();
				},
				hide: function() {
					animate.move(iElm, { target: {opacity: 0}, time: 300, fn: function() {
						iElm.css('display', 'none');
						$interval.cancel(timer);
					}});
				},
				run: function() {
					var time = 1500;
					var fn = function() {
						elm.css({'-webkit-transform':'rotate(0deg)','-moz-transform':'rotate(0deg)','-ms-transform':'rotate(0deg)','-o-transform':'rotate(0deg)','transform':'rotate(0deg)'
						});
						animate.transform(elm, {target: {rotate: 360}, time: time, fx: 'easeBothStrong'});
					};
					fn();
					timer = $interval(fn, time);
				}
			};
		}
	};
}]);


direc.directive('noteTags', ['$window', function($window){
	return {
		link: function($scope, iElm, iAttrs) {
			angular.element($window).bind('scroll', function() {
				var t = this.document.body.scrollTop || this.document.documentElement.scrollTop;
				if( t > 20 ) {
					iElm.addClass('tag-fix');
				} else {
					iElm.removeClass('tag-fix');
				}
			});
		}
	};
}]);


direc.directive('setHeight', function(){
	return {
		link: function($scope, iElm, iAttrs) {
			iElm.css('minHeight', CLIENT_H + 'px');
		}
	};
});


direc.directive('pubuliu', ['$timeout', '$window', 'ysAnimate', 'ysHttp', function($timeout, $window, animate, ajax){
	return {
		link: function($scope, iElm, iAttrs) {
			var sections = iElm.find('section');
			var w = sections.eq(0)[0].offsetWidth;
			var scale = w / 400;
			var bo = true, height;
			var run = function() {
				var data = $scope.data.demos;
				var len = data.length;
				var time = 10;
				var distance = 600;
				angular.forEach(data, function(el, i) {
					time += 100;
					var height = el.height * scale;
					var box = angular.element('<div class="box">');
					var str =  '<a href="'+el.path+'" target="_blank"><div class="time">'+el.time+'</div><img src="'+el.path+'/photo.jpg" style="height:'+height+'px"><div class="text"><h3>'+el.title+'</h3><p>'+el.desc+'</p></div></a>';
					box.html( str );
					box.css('opacity', 0);
					sections.eq( getMinSection(sections) ).append( box );
					$timeout(function() {
						animate.move(box, {
							target: { opacity: 1},
							time: 400
						});
					}, time);
				});
				height = iElm[0].offsetHeight;
				if( bo ) {
					bo = false;
					req();
				}
			};

			var req = function() {
				angular.element($window).bind('scroll', function() {
					var t = this.document.body.scrollTop || this.document.documentElement.scrollTop;
					if( t > height - CLIENT_H ) {
						if( $scope.data.httpBo && $scope.data.nowLen < $scope.data.length ) {
							$scope.data.httpBo = false;
							$scope.fnHttp( $scope.data.nowLen );
						}
					}
				});
			};

			$scope.$watch('data.demos', function(newVal, oldVal) {
				if( newVal != oldVal ) run();
			});
		}
	};
}]);

function getMinSection( sections ) {
	var len = sections.length;
	arr = [];
	for( var i=0; i<len; i++ ) {
		var json = {};
		json.index = i;
		json.height = sections.eq(i)[0].offsetHeight;
		arr.push( json );
	}

	arr.sort(function(a, b) {
		return a.height - b.height;
	});
	return arr[0].index;
}


direc.directive('signIn', ['ysAnimate', function(animate){
	return {
		template:  '<p>亲，留个信息呗 ^_^</p>'+
					'<div>'+
						'<input type="text" placeholder="昵称" ng-model="msg.nk">'+
					'</div>'+
					'<div>'+
						'<input type="text" placeholder="QQ号码" ng-model="msg.qq">'+
					'</div>'+
					'<p>QQ号码仅用作获取头像方便交流之用</p>'+
					'<div>'+
						'<span class="btn" ng-click=fn.confirm()>确定</span>'+
						'<span class="btn" ng-click=fn.hideLogin()>取消</span>'+
					'</div>',
		// templateUrl: 'views/signIn.html',
		link: function($scope, iElm, iAttrs) {
			var h = iElm[0].offsetHeight;
			var late = CLIENT_H/2 + h;
			var t = CLIENT_H/2-h/2;
			var blur;
			/*iElm.css({
				'top': CLIENT_H/2-h/2 + 'px',
				'-webkit-transform': 'translate(0px, '+(-late)+'px)',
				'-moz-transform': 'translate(0px, '+(-late)+'px)',
				'-ms-transform': 'translate(0px, '+(-late)+'px)',
				'-o-transform': 'translate(0px, '+(-late)+'px)',
				'transform': 'translate(0px, '+(-late)+'px)',
			});*/
			iElm.css({
				top: t + 'px',
				opacity: 0,
				display: 'none'
			});
			$scope.$watch('loginBo', function(newVal, oldVal) {
				if( newVal != oldVal ) {
					if( newVal ) {
						iElm.find('input').eq(0)[0].focus();					
						/*animate.transform(iElm, {
							target: { translate: [0, 0] },
							time: 700, fx: 'backOut'
						});*/
						iElm.css('display', 'block');
						animate.move(iElm, { target: {opacity: 1}, time: 400});
					} else {
						/*animate.transform(iElm, {
							target: { translate: [0, -late] },
							time: 700, fx: 'easeOutStrong'
						});*/
						animate.move(iElm, { target: {opacity: 0}, time: 400});
						setTimeout(function() {
							iElm.css('display', 'none');
						}, 400);
					}
				}
			});
		}
	};
}]);


direc.directive('dialog', ['$timeout', 'ysAnimate', function($timeout, animate){
	return {
		template: '<p bindonce ng-bind-html="msg.dialog | to_trusted"></p>',
		link: function($scope, iElm, iAttrs) {
			iElm.css({ display: 'none', opacity: 0, top: CLIENT_H/2 + 'px' });
			$scope.$watch('dialogBo', function(newVal, oldVal) {
				if( newVal != oldVal && newVal ) {
					var h = iElm[0].offsetHeight;
					iElm.css({
						display: 'block',
						marginTop: -(h/2 + 50) + 'px'
					});
					animate.move(iElm, { target: { opacity: 1 }, time: 400 });

					var run = function() { iElm.css('display', 'none'); };
					$timeout(function() {
						animate.move(iElm, { target: { opacity: 0 }, time: 400, fn: run });
					}, 2600);
					$timeout(function() { $scope.dialogBo = false; }, 3000);
				}
			});
		}
	};
}]);


direc.directive('autoFocus', function(){
	return {
		link: function($scope, iElm, iAttrs) {
			$scope.$watch('autoFocus', function(newVal) {
				if( newVal ) {
					iElm[0].focus();
				} else {
					iElm[0].blur();
				}
			});
		}
	};
});


direc.directive('ctrlHeight', ['$timeout', 'ysAnimate', function($timeout, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			$scope.$watch('ctrlHeightBo', function(newVal) {
				if( newVal ) {
					var h = iElm[0].offsetHeight;
					iElm.css('height', h + 'px');
					document.documentElement.scrollTop = document.body.scrollTop = 0;
					animate.move(iElm, {
						target: { height: 0 },
						time: 600, fx: 'easeOutStrong'
					});
					$timeout(function() {
						$scope.getMsg( $scope.replyPageNum, true );
						$scope.ctrlHeightBo = false;
					}, 10); // loading的show+hide刚好600ms
				}
			});

			$scope.$watch('ctrlOpenUlBo', function(newVal) {
				// 此处watch有轻微延迟
				if( newVal ) {
					$timeout(function() {
						var lis = iElm.find('li');
						var len = lis.length;
						var mh = (len-1)*50+30;
						
						for( var i=0; i<len; i++ ) mh += lis[i].offsetHeight;
						animate.move(iElm, {
							target: { height: mh },
							time: 600, fx: 'easeInStrong'
						});
						$timeout(function() {
							$scope.ctrlOpenUlBo = false;
						}, 600);
					}, 10);
				}
			});
		}
	};
}]);


direc.directive('opacityBox', ['ysAnimate', function(animate){
	return {
		link: function($scope, iElm, iAttrs) {
			iElm.css('opacity', 1);
			$scope.$watch('data.opacitBo', function(newVal, oldVal) {
				if( newVal ) return animate.move(iElm, { target: { opacity: 0}, time: 400 });
				animate.move(iElm, { target: { opacity: 1}, time: 400 });
			});
		}
	};
}]);


direc.directive('getCommentTop', function(){
	return {
		link: function($scope, iElm, iAttrs) {
			var textarea = iElm.find('textarea');
			$scope.$watch('startBo', function(newVal) {
				if( newVal ) {
					setTimeout(function() {
						$scope.data.texareaT = iElm[0].offsetTop - 50;
					}, 50);
				}
			});

			$scope.$watch('data.autoFocus', function(newVal) {
				if( newVal ) textarea[0].focus();
			});
		}
	};
});


direc.directive('openHref', function(){
	return {
		link: function($scope, iElm, iAttrs) {
			$scope.$watch('startBo', function(newVal) {
				if( newVal ) {
					setTimeout(function() {
						var a = iElm.find('a');
						a.attr('target', '_blank');
					}, 50);
				}
			});
		}
	};
});


direc.directive('siteSummary', ['$window', 'ysAnimate', function($window, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var p = iElm.find('p');
			var distance = 800;
			p.eq(0).css({
				'-webkit-transform': 'translate('+(-distance)+'px, 0px)',
				'-moz-transform': 'translate('+(-distance)+'px, 0px)',
				'-ms-transform': 'translate('+(-distance)+'px, 0px)',
				'-o-transform': 'translate('+(-distance)+'px, 0px)',
				'transform': 'translate('+(-distance)+'px, 0px)',
				'opacity': 0
			});
			p.eq(1).css({
				'-webkit-transform': 'translate('+distance+'px, 0px)',
				'-moz-transform': 'translate('+distance+'px, 0px)',
				'-ms-transform': 'translate('+distance+'px, 0px)',
				'-o-transform': 'translate('+distance+'px, 0px)',
				'transform': 'translate('+distance+'px, 0px)',
				'opacity': 0
			});
			p.eq(2).css('opacity', 0);
			var limit = iElm[0].offsetTop + iElm[0].offsetHeight;
			var time = 600;
			var bo = true;
			angular.element($window).bind('scroll', function() {
				var t = this.document.body.scrollTop || this.document.documentElement.scrollTop;
				if( t + CLIENT_H-100 > limit && bo ) {
					bo = false;
					animate.move(p.eq(0), { target: {opacity: 1}, time: time});
					animate.transform(p.eq(0), {target: {translate:[0, 0]},time:time+400, fx: 'backOut'});
					animate.move(p.eq(1), { target: {opacity: 1}, time: time});
					animate.transform(p.eq(1), {target: {translate:[0, 0]},time:time+400, fx: 'backOut'});
					setTimeout(function() {
						animate.move(p.eq(2), { target: {opacity: 1}, time: time });
					}, time+400);
				}
			});
		}
	};
}]);;
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
