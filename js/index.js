
//app模块
var app = angular.module("myApp",["ui.router"]);

// 路由
app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
	//新闻路由
	$stateProvider.state("news",{
		url:"/news",
		templateUrl:"template/news.html",
		controller:"newsCtrl"
	})
	//新闻详情路由
	.state("newscontent",{
		url:"/newscontent/:id/:type",
		templateUrl:"template/newscontent.html",
		controller:"newscontentCtrl"
	})
	//体坛路由
	.state("titan",{
		url:"/titan",
		templateUrl:"template/titan.html",
		controller:"titanCtrl"
	})
	//体坛详情路由
	.state("titan.titancontent",{
		url:"/titancontent",
		templateUrl:"template/titancontent.html",
		controller:"titancontentCtrl"
	})

	.state("movie",{
		url:"/movie",
		templateUrl:"template/movie.html",
		controller:"movieCtrl"
	})

	.state("movie.hotcontent",{
		url:"/hotcontent",
		templateUrl:"template/hotcontent.html",
		controller:"hotcontentCtrl"
	})

	$urlRouterProvider.when("/","/news")
}])

//app run函数 在程序加载时运行
app.run(function(){
	(function(doc, win) {
        var docEl = doc.documentElement;
        resize = function() {
            var clientWidth = docEl.clientWidth;
            docEl.style.fontSize = 100 * (clientWidth / 320) + 'px';
        }
        win.addEventListener('resize', resize);
        win.addEventListener('DOMContentLoaded', resize);

	})(document, window);
})


//新闻控制器
app.controller('newsCtrl', ['$scope', "$http",function($scope,$http){
	$scope.loading = true;
	$http.jsonp("http://localhost/angular_project/php/http.php",{
		params:{
			type:"top",
			callback:"JSON_CALLBACK"
			}

		}).success(function(data){
			$scope.datas = data.result.data;
			$scope.loading = false;
		})
}])

//组件 navs 新闻
app.directive("navs",function($http){
	var obj =  {
		templateUrl:"compontents/navs.html",
			link:function($scope,ele,attr){
				angular.element(document).find("li").on("click",function(){
				$scope.loading = true;
				//导航点击事件
				angular.element(document).find("li").removeClass("select");
				 angular.element(document).find("dl").remove();
				angular.element(this).addClass("select");
				//console.log(angular.element(this).attr("data"))
				var type = angular.element(this).attr("data");
				console.log(type)
				//请求数据
				$http.jsonp("http://localhost/angular_project/php/http.php",{
				params:{
					type:type,
					callback:"JSON_CALLBACK"
					}

				}).success(function(data){
					$scope.loading = false;
					$scope.datas = data.result.data;
					console.log($scope.datas)
				})

			})
		}
	}
	return obj;
})

app.directive("content",function($window,$stateParams){
	var obj = {
		templateUrl:"compontents/content.html",
		link:function($scope,ele,attr){
			$scope.Click = function(id,type){
				console.log(id,type);
				$window.location.href="#/newscontent/"+id+"/"+type;
			}
		}
	}

	return obj
})

//新闻内容路由
app.controller('newscontentCtrl', ['$scope','$http','$stateParams',"$sce",function($scope,$http,$stateParams,$sce){
	// console.log($stateParams.type)
	var id   = $stateParams.id;
	var type = $stateParams.type;
	$http.jsonp("http://localhost/angular_project/php/http.php",{
		params:{
			type:type,
			callback:"JSON_CALLBACK"
			}

	}).success(function(data){
		var url = data.result.data[id].url;
		$http.jsonp("http://localhost/angular_project/php/http1.php",{
			params:{
				url:url,
				callback:"JSON_CALLBACK"
			}
		}).success(function(data){
			$scope.htmlsce = $sce.trustAsHtml(data.match(/<article[^>]*>([\s\S]*?)<\/article>/g)[0]);

		})

	})

}])



app.controller('titanCtrl', ['$scope', function($scope){

}])

app.controller('movieCtrl', ['$scope',"$http", function($scope,$http){

}]);



app.controller("hotcontentCtrl",["$scope","$http",function($scope,$http){
	  $http.jsonp("php/hotmovie.php",{
		params:{
			url:"https://api.douban.com/v2/movie/coming_soon",
			callback:"JSON_CALLBACK"
		}
	}).success(function(data){
		$scope.datas=data.subjects;
		console.log(data.subjects);
	})
}])
app.directive("movienav",function(){
	return {
		templateUrl:"compontents/movienav.html"
	}
})
app.directive("moviebanner",function(){
	var obj = {
		templateUrl:"compontents/moviebanner.html",
		link:function($scope,ele,attr){
			var point = document.querySelector(".point");
			console.log(point)
			
			angular.element(point).find("a").on("click",function(){
				console.log(123)
			})
		}


	}
	return obj
})