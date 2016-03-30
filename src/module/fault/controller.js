define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');
    require('common/directive/paging/directive');
    var config = require('../config');
    var us = require('underscore');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http) {

        function initTime(endDate, len) {
            var timeArr = [];
            var i, timeItem;
            for (i = len; i > 0; i--) {
                var now = new Date(endDate);
                var nowMoment = moment(now);
                timeItem = +(nowMoment.date(nowMoment.date() - (i - 1)).toDate());
                timeArr.push(moment(timeItem).format('YYYY-MM-DD'));
            }
            return timeArr;
        }

        function initValue() {
            $scope.demo = {};
            $scope.locationSetted = '全国';
            $scope.currentLevel = 0;
            $scope.currentId = 0;
            $scope.brokenTypeOptions = config.brokenTypeOptions;
            $scope.brokenType = 1;
            $scope.patternType = 1;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
        }

        function bindEvent() {
            $scope.demo.itemClicked = showLeftTree;
            $scope.getFaultList = getFaultList;
            $scope.switchPattern = switchPattern;
            $scope.$on('changepage', function (event, data) {
                $scope.currentPage = data.page;
                getFaultList();
            });
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

        function switchPattern(type) {
            $scope.patternType = +type;
            $scope.startDate = null;
            $scope.endDate = null;
            $scope.brokenTable = [];
            $scope.brokenTableCount = null;
            $scope.currentPage = 1;
            $scope.brokenChart = null;
        }

        function getFaultList() {
            if (!$scope.endDate || !$scope.startDate) {
                alert('请输入查询日期！');
                return;
            }

            var url;
            var params = {
                level: +$scope.currentLevel,
                id: +$scope.currentId,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                type: +$scope.brokenType
            };

            if ($scope.patternType === 1) {
                url = '/smartcity/api/get_broken_table';
                params.pageDto = {
                    pageNum: $scope.currentPage || 1,
                    pageSize: $scope.pageSize
                };
            }
            else if ($scope.patternType == 2) {
                url = '/smartcity/api/get_broken_chart';
            }

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    if ($scope.patternType === 1) {
                        $scope.brokenTable = res.data.brokenInfo;
                        $scope.brokenTableCount = res.data.pageDto.totalCount;
                    }
                    else if ($scope.patternType === 2) {
                        initEchart(res.data.brokenInfo);
                    }
                } else {
                    alert(res.error);
                }
            }).error(function (res) {
                alert('系统异常！');
            });

        }

        function initEchart(deviceData) {
            var categoryItem = us.findWhere($scope.brokenTypeOptions, {value: $scope.brokenType})['text'];
            var legendDate = [];
            var categoryTitle = us.findWhere($scope.brokenTypeOptions, {value: $scope.brokenType})['title'];
            var itemValue = [];
            var timeLength = (moment($scope.endDate) - moment($scope.startDate)) / 1000 / 3600 / 24 + 1;
            var itemTime = initTime($scope.endDate, timeLength);

            if (deviceData) {
                switch (+$scope.brokenType) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        legendDate.push(categoryItem);
                        itemValue.push({
                            name: categoryItem,
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: deviceData[categoryTitle]
                        })
                        break;
                    case 6:
                        legendDate = ['路灯', '环境', '车辆', '人群', '语音'];
                        itemValue = [
                            {
                                name: '路灯',
                                type: 'line',
                                smooth: true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: deviceData['light']
                            },
                            {
                                name: '环境',
                                type: 'line',
                                smooth: true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: deviceData['environment']
                            },
                            {
                                name: '车辆',
                                type: 'line',
                                smooth: true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: deviceData['vehicle']
                            },
                            {
                                name: '人群',
                                type: 'line',
                                smooth: true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: deviceData['crowd']
                            },
                            {
                                name: '语音',
                                type: 'line',
                                smooth: true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: deviceData['voice']
                            }
                        ];
                        break;
                    default:
                        ;
                }

                $scope.brokenChart = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legendDate
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : itemTime
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : itemValue
                };
                console.log(JSON.stringify($scope.brokenChart));
            }
            else {
                alert('未获取到故障数据！');
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http'];

    return Controller;
});