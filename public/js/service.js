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
}]);