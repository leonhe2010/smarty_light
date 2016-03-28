define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');
    var config = require('../config');
    var us = require('underscore');

    function Controller($scope, $location, $timeout, $http) {

        function initValue() {
            $scope.demo = {};
            $scope.locationSetted = '全国';
            $scope.currentLevel = 0;
            $scope.currentId = 0;
            $scope.calibrationOptions = config.calibrationOptions;
            $scope.statisticTypeOptions = config.statisticTypeOptions;
            $scope.statistic = {calibrationOption: 1};
            $scope.statisticType = 1;
        }

        function bindEvent() {
            $scope.demo.itemClicked = showLeftTree;
            $scope.getStatisticInfo = getStatisticInfo;
        }

        function main() {
            initValue();
            bindEvent();
            getChildNode(0, 1);
        }

        function showLeftTree(item) {
            $scope.locationSetted = item.name;
            var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
            $scope.currentLevel = +pidArr.length;
            $scope.currentId = +item.id;

            switch (pidArr.length) {
                case 1:
                    if (!$scope.demo.tree[pidArr[0]]['children']) {
                        getChildNode(item.id, 2, item.pid);
                    }
                    break;
                case 2:
                    if (!$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children']) {
                        getChildNode(item.id, 3, item.pid);
                    }
                    break;
                case 3:
                    if (!$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children']) {
                        getChildNode(item.id, 4, item.pid);
                    }
                    break;
                case 4:
                    break;
                default:
                    ;
            }

            // getLightLocation(pidArr.length, item.id);

            // 1. 查找数据，如果没有重新请求
            // 2. 查找路灯信息
        }

        // 刷新列表
        function setTreeDate(nodes, parentId, parentLevel, parentPid) {
            if (nodes.length === 0) {
                return;
            }
            if (parentLevel === 1) {
                $.each(nodes, function (index, value) {
                    nodes[index].pid = index + 'l';
                });
                $scope.demo.tree = nodes;
            }
            else {
                $.each(nodes, function (index, value) {
                    nodes[index].pid = parentPid + index + 'l';
                });

                var pidArr = parentPid.substr(0, parentPid.length - 1).split('l');
                if (pidArr.length === 1) {
                    $scope.demo.tree[pidArr[0]]['children'] = nodes;
                }
                else if (pidArr.length === 2) {
                    $scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'] = nodes;
                }
                else if (pidArr.length === 3) {
                    $scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children'] = nodes;
                }
            }
            console.log($scope.demo.tree);
        }

        function getChildNode(id, level, pid) {
            var url = '/smartcity/api/get_child_node';

            var params = {
                id: +id,
                level: +level
            };

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    setTreeDate(res.data.nodes, id, level, pid);
                } else {
                    alert('获取信息失败！');
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        }

        function getStatisticInfo() {
            if (!$scope.endDate) {
                alert('请输入查询日期！');
                return;
            }

            var params = {
                level: +$scope.currentLevel,
                id: +$scope.currentId,
                calibration: +$scope.statistic.calibrationOption,
                endDate: $scope.endDate,
                type: +$scope.statisticType
            };
            var url = '/smartcity/api/get_statistic';

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    initEchart(res.data.brokenInfo);
                } else {
                    alert(res.error);
                }
            }).error(function (res) {
                alert('系统异常！');
            });

        }

        function initEchart(deviceData) {
            var categoryItem = us.findWhere($scope.statisticTypeOptions, {value: $scope.statisticType})['text'];
            $scope.categoryItem = categoryItem;
            var itemValue = [];
            var itemTime = [];
            if (deviceData) {
                $.each(deviceData, function (index, value) {
                    itemValue.push(value.value);
                    itemTime.push(value.time);
                });
                $scope.statisticInfo = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: itemTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: categoryItem,
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: itemValue
                        }
                    ]
                };
            } else {
                alert('未获取到统计数据！');
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http'];

    return Controller;
});