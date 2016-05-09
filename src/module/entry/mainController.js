define(function (require) {
	var us = require('underscore');
	require('common/directive/editLeftTree/directive');

    function mainController($scope, $location, $interval, $window, $timeout, $rootScope, $http) {
    	$scope.isLoginPage = function () {
    		if ($location.$$path == '/login') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isLoginPage = $scope.isLoginPage;

    	$scope.isProfilePage = function () {
    		if ($location.$$path == '/profile') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isProfilePage = $scope.isProfilePage;

    	$scope.isGeographyPage = function () {
    		if ($location.$$path == '/geography') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isGeographyPage = $scope.isGeographyPage;

    	$scope.isManipulationPage = function () {
    		if ($location.$$path == '/manipulation') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isManipulationPage = $scope.isManipulationPage;

    	$scope.isStatisticPage = function () {
    		if ($location.$$path == '/statistic') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isStatisticPage = $scope.isStatisticPage;

    	$scope.isFaultPage = function () {
    		if ($location.$$path == '/fault') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isFaultPage = $scope.isFaultPage;

    	$scope.isSetPage = function () {
    		if ($location.$$path == '/set') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isSetPage = $scope.isSetPage;

    	function getChildNode(id, level, pid) {
            var url = '/smartcity/api/get_child_node';

            var params = {
                id: +id,
                level: +level
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    setTreeDate(res.data.nodes, id, level, pid);
                } 
                else {
                    util.showMessage('获取信息失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function setTreeDate(nodes, parentId, parentLevel, parentPid) {
            // if (nodes.length === 0) {
            //     return;
            // }
            if (parentLevel === 1) {
                $.each(nodes, function (index, value) {
                    nodes[index].pid = nodes[index].id + 'l';
                    nodes[index].level = +parentLevel;
                });
                $rootScope.demo.tree = nodes;
            }
            else {
                $.each(nodes, function (index, value) {
                    nodes[index].pid = parentPid + nodes[index].id + 'l';
                    nodes[index].level = +parentLevel;
                });
                var pidArr = parentPid.substr(0, parentPid.length - 1).split('l');
                if (pidArr.length === 1) {
                    us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'] = nodes;
                }
                else if (pidArr.length === 2) {
                    us.findWhere(us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'] = nodes;
                }
                else if (pidArr.length === 3) {
                    $.each(nodes, function (index, value) {
                        nodes[index]['addShow'] = true;
                    });
                    us.findWhere(us.findWhere(us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'], {id: pidArr[2]})['children'] = nodes;
                }
            }
            console.log($rootScope.demo.tree);
        }

        function showLeftTree(item) {
            $rootScope.locationSetted = item.name;
            var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
            $rootScope.currentLevel = +pidArr.length;
            $rootScope.currentId = +item.id;

            $('.text-field').removeClass('c_green');
            $.each($('.text-field'), function (key, value) {
                if ($(value).attr('pid') == item.pid) {
                    $(value).addClass('c_green');
                }
            });

            if (pidArr.length > 1) {
                $scope.currentParentId = +pidArr[pidArr.length - 2];
            }

            if (pidArr.length < 4) {
                getChildNode(item.id, pidArr.length + 1, item.pid);
            }
            $scope.$broadcast('initLeftTree');
        }

    	function initValue() {
    		$rootScope.demo = {};
    		$rootScope.locationSetted = '全国';
            $rootScope.currentLevel = 0;
            $rootScope.currentId = 0;
    	}

    	function bindEvent() {
    		$rootScope.getChildNode = getChildNode;
    		$rootScope.setTreeDate = setTreeDate;
            $rootScope.demo.itemClicked = showLeftTree;
            // $rootScope.demo.addItem = addItem;
            // $rootScope.demo.minusItem = minusItem;
        }

        function main() {
        	initValue();
        	bindEvent();
        	getChildNode(0, 1);
        }

        main();

    }

    mainController.$inject = ['$scope', '$location', '$interval', '$window', '$timeout', '$rootScope', '$http'];
    return mainController;
});