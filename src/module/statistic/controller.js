define(function (require) {

    require('common/directive/echartsRe/directive');
    var lightCtrl = require('module/geography/light');
    var config = require('../config');
    var us = require('underscore');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http, util, $modal) {

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
            $scope.calibrationOptions = config.calibrationOptions;
            $scope.statisticTypeOptions = config.statisticTypeOptions;
            $scope.statistic = {calibrationOption: 1};
            $scope.statisticType = 1;
            var now = new Date();
            var nowMoment = moment(now);
            var timeItem = +(nowMoment.date(nowMoment.date() - 1).toDate());
            $scope.endDate = moment(timeItem).format('YYYY-MM-DD');
        }

        function bindEvent() {
            $scope.$on('initLeftTree', function () {
                getLightNum();
            });
            $scope.getStatisticInfo = getStatisticInfo;
            $scope.$on('singleLight', function (event, data) {
                openLightModal(data);
            });
        }

        function main() {
            initValue();
            bindEvent();
            getLightNum();
            getStatisticInfo();
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

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', 'utilService', '$modal'];

    return Controller;
});