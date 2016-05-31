define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/paging/directive');
    var config = require('../config');
    var us = require('underscore');
    var moment = require('moment');
    var lightCtrl = require('module/geography/light');

    function Controller($scope, $location, $timeout, $http, util, $modal) {

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
            $scope.brokenTypeOptions = config.brokenTypeOptions;
            $scope.brokenType = 6;
            $scope.patternType = 1;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            var now = new Date();
            var nowMoment = moment(now);
            $scope.endDate = nowMoment.format('YYYY-MM-DD');
            $scope.startDate = (nowMoment.subtract(365 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');
        }

        function bindEvent() {
            $scope.getFaultList = getFaultList;
            $scope.switchPattern = switchPattern;
            $scope.changeBrokenType = changeBrokenType;
            $scope.$on('initLeftTree', function () {
                getLightNum();
            });
            $scope.$on('changepage', function (event, data) {
                $scope.currentPage = data.page;
                getFaultList();
            });
            $scope.$on('singleLight', function (event, data) {
                openLightModal(data);
            });
        }

        function main() {
            initValue();
            bindEvent();
            getLightNum();
            getFaultList();
            setTimeout(function () {
                $.each($('.text-field'), function (key, value) {
                    if ($(value).attr('pid') == $scope.currentPid) {
                        $(value).addClass('c_green');
                    }
                });
            }, 500);
        }

        function openLightModal(item) {
            var dialog = $modal.open({
                templateUrl: 'src/module/geography/light.html',
                controller: lightCtrl,
                size: 'lg',
                backdrop: 'static',
                scope: $scope,
                resolve: {
                    data: function () {
                        return item;
                    }
                }
            });

            dialog.result.then(
                function () {},
                function (data) {
                    if (data && data.type) {
                        $scope.demo.itemClicked({
                            name: $scope.locationSetted,
                            id: $scope.currentId,
                            level: $scope.currentLevel,
                            pid: $scope.currentPid
                        });
                    }
                }
            );
        }

        function changeBrokenType() {
            $scope.currentPage = 1;
        }

        function getLightNum() {
            var params = {
                level: $scope.currentLevel,
                id: $scope.currentId
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
                util.showMessage('请输入查询日期！');
                return;
            }

            var reg = /^\d\d\d\d\-\d\d\-\d\d$/;

            if (!reg.test($scope.endDate) || !reg.test($scope.startDate)) {
                util.showMessage('请输入正确的日期格式！');
                return;
            }

            if (+new Date($scope.endDate) <= +new Date($scope.startDate)) {
                util.showMessage('开始日期要小于结束日期！');
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
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    if ($scope.patternType === 1) {
                        $scope.brokenTable = res.data.brokenInfo;
                        $scope.brokenTableCount = res.data.pageDto.totalCount;
                    }
                    else if ($scope.patternType === 2) {
                        initEchart(res.data.brokenInfo);
                    }
                } else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
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
                util.showMessage('未获取到故障数据！');
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', 'utilService', '$modal'];

    return Controller;
});