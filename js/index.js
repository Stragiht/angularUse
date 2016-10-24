
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
	.state("watch",{
		url:"/watch",
		templateUrl:"template/watch.html",
		controller:"watchCtrl"
	})
	//体坛详情路由
	.state("watchdetail",{
		url:"/watchdetail/:type",
		templateUrl:"template/watchdetail.html",
		controller:"watchdetailCtrl"
	})

	.state("movie",{
		url:"/movie",
		templateUrl:"template/movie.html",
		controller:"movieCtrl"
	})
	//电影路由之间嵌套
	.state("movie.hotcontent",{
		url:"/hotcontent",
		templateUrl:"template/hotcontent.html",
		controller:"hotcontentCtrl"
	})
	.state("movie.recommond",{
		url:"/recommond",
		templateUrl:'template/recommond.html',
		controller:"moviecontentCtrl"
	})
	.state("movie.serach",{
		url:"/serach",
		templateUrl:"template/serach.html",
		controller:"serachCtrl"
	})
	.state("detail",{
		url:"/detail/:id",
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
	$http.jsonp("php/http.php",{
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
				//应该绑定为 tap 事件 用 swiper 事件 或者引用angular-touch插件
				ele.find("li").on("click",function(){
				$scope.loading = true;
				//导航点击事件
				angular.element(ele).find("li").removeClass("select");
				console.log(angular.element(ele).find("li"))
				angular.element(ele).find("dl").remove();
				angular.element(this).addClass("select");
				//console.log(angular.element(this).attr("data"))
				var type = angular.element(this).attr("data");
				console.log(type)
				//请求数据
				$http.jsonp("php/http.php",{
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

//组件 新闻内容组件
// $statesParams 传递参数
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
	//新闻详情 先请求到数据 ，再请求到url里面的内容 最后渲染到页面上
	$http.jsonp("php/http.php",{
		params:{
			type:type,
			callback:"JSON_CALLBACK"
			}

	}).success(function(data){
		var url = data.result.data[id].url;
		$http.jsonp("php/http1.php",{
			params:{
				url:url,
				callback:"JSON_CALLBACK"
			}
		}).success(function(data){
			$scope.htmlsce = $sce.trustAsHtml(data.match(/<article[^>]*>([\s\S]*?)<\/article>/g)[0]);

		})

	})

}])


//电视控制器
app.controller('watchCtrl', ['$scope','$http', function($scope,$http){
	//默认让 央视 以及央视的节目列表显示在页面上
	//请求电视类型
	$http.jsonp("php/tv.php",{
		params:{
			callback:"JSON_CALLBACK"
		}
	}).success(function(data){
		$scope.datas = data.result;
		console.log($scope.datas)
		//请求电视类型里面的 详情列表
		$http.jsonp("php/tvcontent.php",{
				params:{
					id:1,
					callback:"JSON_CALLBACK"
				}
			}).success(function(data){
				$scope.dataset = data.result;
				console.log($scope.dataset )
			})

	})

}])

//内容详情控制器
app.controller('watchdetailCtrl', ['$scope','$stateParams','$http', function($scope,$stateParams,$http){
	var type = $stateParams.type;
	//请求数据
	$http.jsonp("php/watchdetail.php",{
		params:{
			id:type,
			callback:"JSON_CALLBACK"
		}
	}).success(function(data){
		console.log(data.result)
		$scope.dataset = data.result;
	})

}])
//组件 电视导航
app.directive("watchnav",function($http){
	var obj = {
		templateUrl:"compontents/watchnav.html",
		link:function(scope,ele,attr){
			//点击事件 请求相对应的内容
			scope.choose = function(event,id){
				console.log(event.target);
				console.log(angular.element(ele).find("li"))
				//清除所有的class名
				angular.element(ele).find("li").removeClass("watch-true");

				// 添加样式
				angular.element(event.target).addClass("watch-true");

				// this.className = "watch-true"
				var index=id;
				scope.loading = true;
				$http.jsonp("php/tvcontent.php",{
					params:{
						id:index,
						callback:"JSON_CALLBACK"
					}
				}).success(function(data){
					scope.loading = false;
					scope.dataset = data.result;
					console.log(scope.dataset )
				})
			}
		}
	}
	return obj
})

//电视内容 点击跳转 到详情路由
app.directive("watchcontent",function($http,$window,$stateParams){
	var obj = {
		templateUrl:"compontents/watchcontent.html",
		link:function(scope,ele,attr){
			scope.watchdetail=function(type){
				$window.location.href = "#/watchdetail/"+type;
				/*console.log(type)
				*/
			}
		}

	}

	return obj;
})

//电影控制器 貌似没用到，但是必须要有 否则报错
app.controller('movieCtrl', ['$scope',"$http", function($scope,$http){


}]);


//电影热映控制器
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

//电影导航组件
app.directive("movienav",function(){
	return {
		templateUrl:"compontents/movienav.html",
		link:function(scope,ele,attr){
			ele.find("li").on("click",function($event){
				console.log(ele.find("li"))
				ele.find("li").removeClass("moviestyle");

				angular.element($event.target).addClass("moviestyle")
			})
		}
	}
})

//电影轮播图组件 自己闲的
//可以用 swiper
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

//电影内容组件  可以共用
app.directive("moviecontent",function($window){
	var obj = {
		templateUrl:"compontents/moviecontent.html",
		//点击事件 跳到详情页
		link:function($scope,ele,attr){

			$scope.detail = function(id){
				$window.location.href="#/detail/"+id;
			}

		}
	}

	return obj
})

//电影内容控制器
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

//电影搜索控制器
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

//详情控制器
app.controller("detailCtrl",["$scope","$stateParams","$http",function($scope,$stateParams,$http){
	var id = $stateParams.id;
	 $http.jsonp("php/hotmovie.php",{
			params:{
				url:"https://api.douban.com/v2/movie/subject/"+id,
				callback:"JSON_CALLBACK"
			}
		}).success(function(data){
			console.log(data);
			$scope.data =data;
		})

}])

app.directive("back",function(){
	var obj = {
		templateUrl:"compontents/back.html",
		link:function(scope,ele,attr){
			scope.back = function(){
				console.log(1);
				history.back();
			}
		}
	}
	return obj
})

//  url:"https://api.douban.com/v2/movie/subject/"+movieId,