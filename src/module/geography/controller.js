define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');
    require('common/directive/baiduMap/directive');
    var config = require('../config');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http, $modal) {

        function initValue() {
            $scope.demo = {};
            $scope.calibrationOptions = config.calibrationOptions;
        }

        function bindEvent() {
            $scope.demo.itemClicked = showLeftTree;
            $scope.$on('batchreject', function (event, data) {
                getLightDetail(data.lightId);
            });
        }

        function main() {
            initValue();
            bindEvent();
            getChildNode(0, 1);
            getLightLocation(0, 0);
        }

        function getLightDetail(lightId) {
            var url = '/smartcity/api/get_light_detail';
            var params = {
                lightId: +lightId
            };

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    showLightModal(res.data, lightId);
                }
                else {
                    alert(res.error);
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        }

        function showLightModal(data, lightId) {
            $scope.detail = data;
            $scope.lightType = 1;
            $scope.lightTypeShow = '路灯';
            $scope.detail.calibration = 1;

            var detailModal = $modal.open({
                templateUrl: 'src/module/geography/light.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static'
            });

            $scope.closeModal = function () {
                detailModal.close();
            };

            $scope.switchLightType = function (event) {
                $scope.lightType = +$(event.target).attr('type');
                $scope.lightTypeShow = $(event.target).html();
            };

            $scope.getChartData = function () {
                var url = '/smartcity/api/get_statistic';
                var params = {
                    "id": +lightId,
                    "level": 5,
                    "calibration": +$scope.detail.calibration,
                    "endDate": $scope.endDate,
                    "type": +$scope.lightType
                };
                $http.post(url, params).success(function (res) {
                    if (res.data.result) {
                        initEchart(res.data.info);
                    } else {
                        alert(res.error);
                    }
                }).error(function (res) {
                    alert('系统异常！');
                });
            };

            $scope.getVideo = function () {
                var url = '/smartcity/api/get_light_video';
                var params = {
                    "lightId": +lightId
                };
                $http.post(url, params).success(function (res) {
                    if (res.data.result) {
                        //
                    } else {
                        alert(res.error);
                    }
                }).error(function (res) {
                    alert('系统异常！');
                });
            }
        }

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

        function initEchart(deviceData) {
            var categoryItem = $scope.lightTypeShow;
            var itemValue = deviceData;
            var itemTime = [];
            var i;

            switch (+$scope.detail.calibration) {
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
                $scope.lightTypeInfo = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [categoryItem]
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
                            //stack: '总量',
                            data: itemValue
                        }
                    ]
                };
            } else {
                alert('未获取到统计数据！');
            }
        }

        function showLeftTree(item) {
            var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');

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

            getLightLocation(pidArr.length, item.id);

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

        function getLightLocation(type, id) {
            var params = {
                level: +type,
                id: +id
            };

            var url = '/smartcity/api/get_lat_lng';

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    $scope.list = res.data.location;
                    setTimeout(function () {
                        $scope.initMap();
                    }, 1000);
                    // initEchart(res.data.device);
                } else {
                    alert(res.error);
                }
            }).error(function (res) {
                alert('系统异常！');
            });

        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal'];

    return Controller;
});