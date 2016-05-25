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

    	function getChildNode(id, level, pid, lightNode) {
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
                    var showNode = res.data.nodes;
                    if (lightNode) {
                        showNode = lightNode.concat(res.data.nodes);
                    }
                    setTreeDate(showNode, id, level, pid);
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
                else if (pidArr.length === 4) {
                    us.findWhere(us.findWhere(us.findWhere(us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'], {id: pidArr[2]})['children'], {id: pidArr[3]})['children'] = nodes;
                }
            }
            console.log($rootScope.demo.tree);
        }

        function showLeftTree(item) {
            var pidStr = item.pid.substr(0, item.pid.length - 1);
        	var pidArr = pidStr.split('l');

            if (item.lightId) {
                $rootScope.currentLevel = +pidArr.length - 1;
                $rootScope.currentId = +pidArr[pidArr.length - 2];
                $rootScope.currentPid = pidStr.substr(0, (pidStr.lastIndexOf('l') + 1));
                $rootScope.currentParentId = +pidArr[pidArr.length - 3];

                if ($rootScope.currentLevel === 3) {
                    $rootScope.locationSetted = us.findWhere(us.findWhere(us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'], {id: pidArr[2]})['name'];
                }
                else if ($rootScope.currentLevel === 4) {
                    $rootScope.locationSetted = us.findWhere(us.findWhere(us.findWhere(us.findWhere($rootScope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'], {id: pidArr[2]})['children'], {id: pidArr[3]})['name'];
                }

                $('.text-field').removeClass('c_green');
                $.each($('.text-field'), function (key, value) {
                    if ($(value).attr('pid') == $rootScope.currentPid) {
                        $(value).addClass('c_green');
                    }
                });

                $scope.$broadcast('initLeftTree');
                $scope.$broadcast('singleLight', item);
                return;
            }

            $rootScope.locationSetted = item.name;
            $rootScope.currentLevel = +pidArr.length;
            $rootScope.currentId = +item.id;
            $rootScope.currentPid = item.pid;
            if (pidArr.length > 1) {
                $rootScope.currentParentId = +pidArr[pidArr.length - 2];
            }

            $('.text-field').removeClass('c_green');
            $.each($('.text-field'), function (key, value) {
                if ($(value).attr('pid') == item.pid) {
                    $(value).addClass('c_green');
                }
            });
            
            if (pidArr.length < 3) {
                getChildNode(item.id, pidArr.length + 1, item.pid);
            }
            else if (pidArr.length == 3) {
                getUngroupLight(item.id, pidArr.length + 1, item.pid);
            }
            else if (pidArr.length == 4) {
                if (item.lightId) {
                    return;
                }
            	getLightNode(item.id, pidArr.length + 1, item.pid);
            }
            $scope.$broadcast('initLeftTree');
        }

        function getUngroupLight(id, level, pid) {
            var params = {
                id: +id
            };

            var url = '/smartcity/api/get_ungrouped_light';

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    getChildNode(id, level, pid, locationDataHandler(res.data.light, pid));
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function getLightNode(id, level, pid) {
            var params = {
                id: +id,
                level: +level - 1
            };

            var url = '/smartcity/api/get_lat_lng';

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    setTreeDate(locationDataHandler(res.data.location, pid), id, level, pid);
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function locationDataHandler(data, pid) {
        	var desArr = [];
        	$.extend(true, desArr, data);

        	$.each(desArr, function (key, value) {
        		value.name = value.lightName;
                value.id = 'z' + value.lightId;
        		value.pid = pid + value.lightId + 'l';
        	});

        	return desArr;
        }

    	function initValue() {
    		$rootScope.demo = {};
    		$rootScope.locationSetted = '全国';
            $rootScope.currentLevel = 0;
            $rootScope.currentId = 0;
            $rootScope.currentPid = null;
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