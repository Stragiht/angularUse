
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
	.state("movie.recommond",{
		url:"/recommond",
		templateUrl:'compontents/moviecontent.html',
		controller:"moviecontentCtrl"
	})
	.state("movie.serach",{
		url:"/serach",
		templateUrl:"template/serach.html",
		controller:"serachCtrl"
	})
	.state("movie.detail",{
		url:"/detail",
		templateUrl:"template/detail.html",
		controller:"detailCtrl"
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
	  $scope.loading = true;
	  $http.jsonp("php/hotmovie.php",{
		params:{
			url:"https://api.douban.com/v2/movie/coming_soon",
			callback:"JSON_CALLBACK"
		}
	}).success(function(data){
		$scope.datas=data.subjects;
		$scope.loading = false;
		// console.log(data.subjects);
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
			var banner = document.querySelector(".banner")
			var oList = document.querySelector(".list")
			var arrImg = ele.find("img");
			var length = arrImg.length;
			var liWidth = arrImg[0].offsetWidth;
			console.log(liWidth)
			oList.style.width= liWidth*length+"px";
			console.log(oList.offsetWidth);
			var time = setInterval(move,2000);
			var arrBtn = ele.find("ul").eq(1).find("a");

			var i= 0;
			function move(){
				var obj = ele.find("ul").eq(0)
				i++;
				if(i>3){
					obj.css({"transition":"none","left":0});
					i=0;
					// obj.css("left",0)

				}else{
					obj.css("left",-liWidth*i+"px");
					obj.css("transition","all 1s");

				}
				for(var j=0;j<arrBtn.length;j++){

					if (i==j){
						angular.element(arrBtn[j]).addClass("active");
					}else{
						angular.element(arrBtn[j]).removeClass("active");
					}
				}


			}
			for (var j=0;j<arrBtn.length;j++){
				arrBtn[j].xxx=j;
				arrBtn[j].onclick=function(){
					console.log(this.xxx);
					i=this.xxx -1;
					btnMove();
				}
			}

			function btnMove(){
				clearInterval(time);
				move();
				time =setInterval(move,2000)
			}
		}

	}
	return obj
})

app.directive("moviecontent",function(){
	var obj = {
		templateUrl:"compontents/moviecontent.html",
	}

	return obj
})

app.controller('moviecontentCtrl', ['$scope',"$http", function($scope,$http){
	 $scope.loading = true;
	 $http.jsonp("php/hotmovie.php",{
		params:{
			url:"https://api.douban.com/v2/movie/top250",
			callback:"JSON_CALLBACK"
		}
	}).success(function(data){
		$scope.datas=data.subjects;
		$scope.loading = false;
		console.log(data.subjects);
	})
}])

app.controller('serachCtrl', ['$scope',"$http", function($scope,$http){

	 $scope.content = "",
	 $scope.serach = function(){
	 	if(!$scope.content){
	 		alert("请输入你要搜索的内容！")
	 		return
	 	}
	 	$scope.loading = true;
		 $http.jsonp("php/hotmovie.php",{
			params:{
				url:"https://api.douban.com/v2/movie/search?q="+$scope.content,
				callback:"JSON_CALLBACK"
			}
		}).success(function(data){
			$scope.datas=data.subjects;
			$scope.loading = false;
			//console.log(data.subjects);
		})
	 }
}])
//加载时出现的标志
app.directive("load",function(){
	var obj ={
		templateUrl:"compontents/loading.html"
	}

	return obj
})

app.service('detail', [function($window){
	return{
		detail:function(id){
			$window.location.href = "#/detail/"+id;
		}
	}
}])
//  url:"https://api.douban.com/v2/movie/subject/"+movieId,