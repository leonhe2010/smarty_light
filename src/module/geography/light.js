define(function (require, exports) {

    require('common/directive/echartsRe/directive');
    require('common/directive/paging/directive');
    var config = require('../config');
    var moment = require('moment');

    function Controller($scope, $location, $timeout, $http, $modal, $sce, util, $modalInstance, data) {

        function initValue() {
            $scope.lightId = data.lightId;
            $scope.isDrag = false;
            $scope.ox = 0;
            $scope.left = 0;
            $scope.brightness = 0;
            $scope.calibrationOptions = config.calibrationOptions;
            var nowMoment = moment(new Date());
            $scope.endDate = nowMoment.format('YYYY-MM-DD');
            $scope.lightType = 1;
            $scope.lightTypeShow = '电流';
        }

        function bindEvent() {
            $scope.postPtn = postPtn;
            $scope.dragBtn = dragBtn;
            $scope.releaseBtn = releaseBtn;
            $scope.calculateWidth = calculateWidth;
            $scope.getVideo = getVideo;
            $scope.getChartData = getChartData;
            $scope.switchLightType = switchLightType;
            $scope.closeModal = closeModal;
        }

        function main() {
            initValue();
            bindEvent();
            getLightDetail($scope.lightId);            
        }

        function dragBtn(event) {
            $scope.ox = event.pageX - $scope.left;
            $scope.isDrag = true;
        }

        function releaseBtn(event) {
            $scope.isDrag = false;
        }

        function calculateWidth(event) {
            if ($scope.isDrag) {
                $scope.left = event.pageX - $scope.ox;
                if ($scope.left < 0) {
                    $scope.left = 0;
                }
                if ($scope.left > 700) {
                    $scope.left = 700;
                }
                $('#bt').css('left', $scope.left);
                $('#bgcolor').width($scope.left);
                $scope.brightness = parseInt($scope.left / 7);
                $('#text').html(parseInt($scope.left / 7));
            }
        }

        function initBrightness() {
            $scope.ox = 0;
            $scope.left = 0;
            $('#bt').css('left', $scope.left);
            $('#bgcolor').width($scope.left);
            $scope.brightness = parseInt($scope.left / 7);
            $('#text').html(parseInt($scope.left / 7));
        }

        function postPtn() {
            var params = {};
            var url = '/smartcity/api/set_light_manual';
            var params = {
                id: $scope.lightId,
                level: 5,
                brightness: $scope.brightness,
                duration: +$scope.duration,
                type: 6
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    util.showMessage('设置成功！');
                    initBrightness();
                    $scope.duration = null;
                } 
                else {
                    util.showMessage('设置失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function getLightDetail() {
            var url = '/smartcity/api/get_light_detail';
            var params = {
                lightId: $scope.lightId
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.detail = res.data;
                    $scope.detail.calibration = 1;
                    getChartData();
                }
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function closeModal() {
            $modalInstance.dismiss();
        }

        function switchLightType(event) {
            $scope.lightType = +$(event.target).attr('type');
            $scope.lightTypeShow = $(event.target).html();
        }

        function getChartData() {
            if (!$scope.endDate) {
                util.showMessage('请输入查询日期！');
                return;
            }
            
            var url = '/smartcity/api/get_statistic';
            var params = {
                "id": $scope.lightId,
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
        }

        function getVideo() {
            var url = '/smartcity/api/get_light_video';
            var params = {
                "lightId": $scope.lightId
            };
            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    showVideoModal(res.data, $scope.lightId);
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
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
                    "lightId": $scope.lightId,
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

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal', '$sce', 'utilService', '$modalInstance', 'data'];

    return Controller;
    
});