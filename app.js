

var app = angular.module('app',[]);
app.controller('myController', ['$scope', '$window', '$location', function($scope, $window, $location) {
	//用于显示初始的数据
	$scope.tasks = [{
		id:1,
		content: '吃饭',
		isCompleted: true,
	},{
		id:2,
		content: '睡觉',
		isCompleted: true,
	},{
		id:3,
		content: '打豆豆',
		isCompleted: false,
	}];

	//保存全局正在编辑的id
    $scope.editingId = -1;
	// ? items left 剩余任务数
    $scope.leftTask = 0;
    //声明全选反选的初始值
    $scope.toggle = false;
    //添加一个  4 喝奶茶

    //声明一个默认的过滤器匹配对象
    $scope.myfilterObj = {}; //全部显示

    //声明显示样式的状态码 ，默认是全部
    $scope.selectedNum = 2;
    //clean按钮的判断
    $scope.showClean = true;


	// 删除任务
	$scope.delTask = function( index ) {
		console.log(1);
		$scope.tasks.splice(index,1);
	}

	$scope.addTask = function() {
		var maxId = $scope.tasks[0].id;
		for (var i = 1; i < $scope.tasks.length; i++) {
			var tmp = $scope.tasks[i];
                if (maxId < tmp.id) {
                    maxId = tmp.id;
                }
		}
		maxId++;
		$scope.tasks.push({
            id: maxId,
            content: $scope.newTask, //对象的属性最后可以多个,函数的参数中不可以
        });
        $scope.newTask = '';
	}

	//双击后编辑
	$scope.editing = function(task){
		$scope.editingId = task.id;
	}
	$scope.edit = function(id){
		$scope.editingId = -1;
	}

	$scope.$watch('tasks',function(newV,oldV){
		var num = 0;
		$scope.showClear = false;
		for (var i = $scope.tasks.length - 1; i >= 0; i--) {
			var tmp = $scope.tasks[i];
			if (!tmp.isCompleted) num++;
		}
		$scope.leftTask = num;

		if (($scope.tasks.length - num) === 0 ) {
			$scope.showClear = false;
		}else {
			$scope.showClear = true;
		}
	},true);

		$scope.toggleAll = function(){
			if ($scope.toggle) {
				for (var i = $scope.tasks.length - 1; i >= 0; i--) {
                    $scope.tasks[i].isCompleted = true;
                }
			}else {
				for (var i = $scope.tasks.length - 1; i >= 0; i--) {
                    $scope.tasks[i].isCompleted = !$scope.tasks[i].isCompleted;
                }
			}
		}

		 //监视锚点值改变的正确方式
        $scope.tempUrlObj = $location;
        //监视
        $scope.$watch('tempUrlObj.url()', function(newV, oldV) {
            //可以使用三种类型的对象完成过滤
            //全部选择:空对象
            //显示已经完成的 {isCompleted:true}
            //显示未完成的 {isCompleted:false}
            ///completed
            ///active
            // /
            // if (newV === oldV) return;  刷新的时候，原来的old和new一致有bug
            switch (newV) {
                case '/completed': //已完成
                    $scope.myfilterObj = {
                        isCompleted: true
                    };
                    //保存一个显示样式的状态码
                    $scope.selectedNum = 1;
                    break;
                case '/': //全部
                    $scope.myfilterObj = {};
                    //保存一个显示样式的状态码
                    $scope.selectedNum = 2;
                    break;
                case '/active': //显示未完成的
                    $scope.myfilterObj = {
                        isCompleted: false
                    };
                    //保存一个显示样式的状态码
                    $scope.selectedNum = 3;
                    break;
            }

        });

         //clean completed
        $scope.cleanTasks = function() {
            for (var i = 0; i < $scope.tasks.length; i++) { //i--的值和i当前是一致的
                if ($scope.tasks[i].isCompleted) $scope.tasks.splice(i--, 1);
                //i-- 也就是还是从之前的那个索引来做，这样就不会跳过中间那个了
            }
        }


}])