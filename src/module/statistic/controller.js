define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');
    var config = require('../config');
    var us = require('underscore');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http, util) {

        function initTime(endDate, len) {
            var timeArr = [];
            var i, timeItem;

            if (len == 12) {
                for (i = len; i > 0; i--) {
                    timeItem = moment(new Date(endDate)).subtract(i - 1, 'months');
                    timeArr.push(timeItem.format('YYYY-MM'));
                }
            }
            else {
                for (i = len; i > 0; i--) {
                    var now = new Date(endDate);
                    var nowMoment = moment(now);
                    timeItem = +(nowMoment.date(nowMoment.date() - (i - 1)).toDate());
                    timeArr.push(moment(timeItem).format('YYYY-MM-DD'));
                }
            }

            return timeArr;
        }

        function initValue() {
            $scope.demo = {};
            $scope.locationSetted = '全国';
            $scope.currentLevel = 0;
            $scope.currentId = 0;
            $scope.calibrationOptions = config.calibrationOptions;
            $scope.statisticTypeOptions = config.statisticTypeOptions;
            $scope.statistic = {calibrationOption: 4};
            $scope.statisticType = 1;
            var now = new Date();
            var nowMoment = moment(now);
            $scope.endDate = nowMoment.format('YYYY-MM-DD');
        }

        function bindEvent() {
            $scope.demo.itemClicked = showLeftTree;
            $scope.getStatisticInfo = getStatisticInfo;
        }

        function main() {
            initValue();
            bindEvent();
            getChildNode(0, 1);
            getLightNum(0, 0);
            getStatisticInfo();
        }

        function getLightNum(type, id) {
            var params = {
                level: +type,
                id: +id
            };

            var url = '/smartcity/api/count_light';

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.allLight = res.data.all;
                    $scope.openLight = res.data.open;
                    $scope.closeLight = res.data.close;
                    $scope.faultLight = res.data.fault;
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function showLeftTree(item) {
            $scope.locationSetted = item.name;
            var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
            $scope.currentLevel = +pidArr.length;
            $scope.currentId = +item.id;

            $('.text-field').removeClass('c_green');
            $.each($('.text-field'), function (key, value) {
                if ($(value).attr('pid') == item.pid) {
                    $(value).addClass('c_green');
                }
            });

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
            getLightNum(pidArr.length, item.id);
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

        function getStatisticInfo() {
            if (!$scope.endDate) {
                util.showMessage('请输入查询日期！');
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
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    initEchart(res.data.info);
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });

        }

        function initEchart(deviceData) {
            var categoryItem = us.findWhere($scope.statisticTypeOptions, {value: $scope.statisticType})['text'];
            $scope.categoryItem = categoryItem;
            var itemValue = deviceData;
            var itemTime = [];
            var i;

            switch (+$scope.statistic.calibrationOption) {
                case 1:
                    for (i = 0; i < 24; i++) {
                        itemTime.push('' + i + '时');
                    }
                    break;
                case 2:
                    itemTime = initTime($scope.endDate, 7);
                    break;
                case 3:
                    itemTime = initTime($scope.endDate, 30);
                    break;
                case 4:
                    itemTime = initTime($scope.endDate, 12);
                    break;
                default:
                    ;
            }
            if (deviceData) {
                $scope.statisticInfo = {
                    tooltip: {
                        trigger: 'axis'
                    },
                     legend: {
                        data:[categoryItem]
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
                util.showMessage('未获取到统计数据！');
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', 'utilService'];

    return Controller;
});