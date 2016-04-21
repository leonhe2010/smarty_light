define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');
    require('common/directive/baiduMap/directive');
    require('common/directive/paging/directive');
    var config = require('../config');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http, $modal, $sce, util) {

        function initValue() {
            $scope.demo = {};
            $scope.locationSetted = '全国';
            $scope.currentLevel = 0;
            $scope.currentId = 0;
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
            getLightNum(0, 0);
        }

        function getLightDetail(lightId) {
            var url = '/smartcity/api/get_light_detail';
            var params = {
                lightId: +lightId
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    showLightModal(res.data, lightId);
                }
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
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
                if (!$scope.endDate) {
                    util.showMessage('请输入查询日期！');
                    return;
                }
                
                var url = '/smartcity/api/get_statistic';
                var params = {
                    "id": +lightId,
                    "level": 5,
                    "calibration": +$scope.detail.calibration,
                    "endDate": $scope.endDate,
                    "type": +$scope.lightType
                };
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
            };

            $scope.getVideo = function () {
                var url = '/smartcity/api/get_light_video';
                var params = {
                    "lightId": +lightId
                };
                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        showVideoModal(res.data, lightId);
                    } 
                    else {
                        util.showMessage(res.error);
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });
            }
        }

        function showVideoModal(videoData, lightId) {
            $scope.videoLightNum = videoData.lightNum;
            $scope.videoSrc = $sce.trustAsResourceUrl(videoData.videoSrc);
            $scope.videoTab = 1;
            $scope.currentPage = 1;
            $scope.pageSize = 10;

            var videoModal = $modal.open({
                templateUrl: 'src/module/geography/video.html',
                size: 'lg',
                scope: $scope,
                backdrop: 'static'
            });

            $scope.closeVideoModal = function () {
                videoModal.close();
            };

            $scope.getHistoryVideo = function () {
                $scope.videoTab = 2;

                var url = '/smartcity/api/get_light_history_video';
                var params = {
                    "lightId": +lightId,
                    "pageDto": {
                        "pageSize": $scope.pageSize,
                        "pageNum": $scope.currentPage
                    }
                };
                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        $scope.historyVideoList = res.data.videoInfo;
                        $scope.historyVideoCount = res.data.pageDto.totalCount;
                    } 
                    else {
                        util.showMessage(res.error);
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });
            };

            $scope.$on('changepage', function (event, data) {
                $scope.currentPage = data.page;
                $scope.getHistoryVideo();
            });

            $scope.jumpToVideo = function (event) {
                $scope.videoTab = 1;
                $scope.videoSrc = $sce.trustAsResourceUrl($(event.target).html());    
            };
        }


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
                util.showMessage('未获取到统计数据！');
            }
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
            var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
            $scope.locationSetted = item.name;
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

            getLightLocation(pidArr.length, item.id);
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

        function getLightLocation(type, id) {
            var params = {
                level: +type,
                id: +id
            };

            var url = '/smartcity/api/get_lat_lng';

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.list = res.data.location;
                    setTimeout(function () {
                        $scope.initMap();
                    }, 1000);
                    // initEchart(res.data.device);
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });

        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal', '$sce', 'utilService'];

    return Controller;
});