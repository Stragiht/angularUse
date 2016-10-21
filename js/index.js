
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
	.state("news.newcontent",{
		url:"/newcontent",
		templateUrl:"template/newcontent.html",
		controller:"newcontentCtrl"
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
	$http.jsonp("http://localhost/angular_project/php/http.php",{
		params:{
			type:"top",
			callback:"JSON_CALLBACK"
			}
			
		}).success(function(data){
			$scope.data = data.result.data;
			
		})
}])

//组件 navs 新闻
app.directive("navs",function($http){
	var obj =  {
		templateUrl:"compontents/navs.html",
		link:function(scope,ele,attr){
			angular.element(document).find("li").on("click",function(){
				//console.log(angular.element(this).attr("data"))
				var type = angular.element(this).attr("data")
				$http.jsonp("http://localhost/angular_project/php/http.php",{
				params:{
					type:"top",
					callback:"JSON_CALLBACK"
					}
					
				}).success(function(data){
					scope.data = data.result.data;
					console.log(scope.data)
				})

			})
		}
	}
	return obj;
})

		

app.controller('titanCtrl', ['$scope', function($scope){

}])