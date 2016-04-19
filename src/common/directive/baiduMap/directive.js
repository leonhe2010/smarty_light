define(function (require) {
    'use strict';
    var BMap = require('async!baiduMap');
    // var BMap = require('baiduMap');
    var $ = require('jquery');

    var module = require('../directives');
    module.directive('baiduMap', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            // scope: false,
            templateUrl: 'src/common/directive/baiduMap/tpl.html',
            replace: true,
            link: function ($scope, $element) {
                require(['baiduMap'], function (BMap) {
                    // 地图信息
                    var map;
                    // 图标
                    var points;
                    // 图标提示信息
                    var opts;
                    // 图标坐标
                    var mapPoints;
                    // marker对象,key:id,value:maker
                    var markers;
                    // 普通icon
                    function getComIcon(i, isWorked) {
                        if (isWorked == 1) {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(20, 28),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -165)
                                }
                            );
                        }
                        else if (isWorked == 2) {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(20, 28),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -129)
                                }
                            );
                        }
                        else {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(20, 28),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -202)
                                }
                            );
                        }
                        
                    }

                    // 激活icon
                    function getActiveIcon(i, isWorked) {
                        // 激活icon
                        if (isWorked == 1) {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(24, 34),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -42)
                                }
                            );
                        }
                        else if (isWorked == 2) {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(24, 34),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -2)
                                }
                            );
                        }
                        else {
                            return new BMap.Icon(
                                'src/resource/images/markers_new.png',
                                new BMap.Size(24, 34),
                                {
                                    // offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(-15, -86)
                                }
                            );
                        }
                    }
                    // function bind() {
                        // var target = $('.clue-visiting-map-list');
                        // target.on('mouseenter', '.record-list-wrapper', function (event) {
                            // var target = $(event.target);
                            // var id = target.attr('data-id');
                            // if (id) {
                            //     var index = target.attr('data-index');
                            //     $scope.$apply(function () {
                            //         $scope.selectedId = id;
                            //     });
                            //     markers[index].setIcon(getActiveIcon(index));
                            // }
                            // console.log('ereer');

                        // });
                        // target.on('mouseleave', '.record-list-wrapper', function () {
                        //     var target = $(event.target);
                        //     var id = target.attr('data-id');
                        //     if (id) {
                        //         var index = target.attr('data-index');
                        //         $scope.$apply(function () {
                        //             $scope.selectedId = null;
                        //         });
                        //         markers[index].setIcon(getComIcon(index));
                        //     }
                        // });
                    // }
                    // 初始化图标
                    function initMaker() {
                        if (points && points.length) {
                            // 设置地图中心
                            map.centerAndZoom(new BMap.Point(points[0].lng, points[0].lat), 15);
                            map.panTo(new BMap.Point(points[0].lng, points[0].lat));
                            // map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
                            mapPoints = [];
                            markers = [];
                            points.forEach(function (v, i) {
                                var pt = new BMap.Point(v.lng, v.lat);
                                mapPoints.push(pt);
                                // 创建标注
                                var marker = new BMap.Marker(pt, { icon: getComIcon(i, v.isWorked) });
                                marker.addEventListener('click', function () {
                                    // $scope.$apply(function () {
                                    //     $scope.selectedId = v.id;
                                    // });
                                    // marker.setIcon(getActiveIcon(i));
                                    // 创建信息窗口对象
                                    // var infoWindow = new BMap.InfoWindow(v.memo, opts);
                                    //开启信息窗口
                                    // map.openInfoWindow(infoWindow, pt);
                                    $scope.$emit('batchreject', {lightId: v.lightId});
                                });
                                marker.addEventListener('mouseover', function () {
                                    $scope.$apply(function () {
                                        $scope.selectedId = v.id;
                                    });
                                    marker.setIcon(getActiveIcon(i, v.isWorked));
                                });
                                marker.addEventListener('mouseout', function () {
                                    $scope.$apply(function () {
                                        $scope.selectedId = null;
                                    });
                                    marker.setIcon(getComIcon(i, v.isWorked));
                                });
                                markers.push(marker);
                                map.addOverlay(marker);
                            });
                        }
                    }

                    // 生成图标之间的连线
                    function initMapLine() {
                        // 设置maker之间的连线
                        var polyline = new BMap.Polyline(
                            mapPoints,
                            {strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5}
                        );
                        map.addOverlay(polyline);
                    }
                    function initMapInfo() {
                        var source = $($element).find('.baidu-map');
                        if (!source.length) {
                            $timeout(function () {
                                initMapInfo();
                            }, 100);
                        }
                        map = new BMap.Map(source[0]);
                        // 启用滚轮放大缩小
                        map.enableScrollWheelZoom(true);
                        var topLeftNavigation = new BMap.NavigationControl();
                        map.addControl(topLeftNavigation);
                        points = $scope.list;
                        initMaker();
                        // initMapLine();
                    }
                    function init() {
                        // 设置提示文本框标题
                        if (!opts) {
                            opts = {
                                width: 250,     // 信息窗口宽度
                                height: 80,     // 信息窗口高度
                                title: '拜访记录:', // 信息窗口标题
                                enableMessage: false//设置允许信息窗发送短息
                            };
                        }
                    }
                    $scope.initMap = function () {
                        // init();
                        initMapInfo();
                        // bind();
                    };

                    // $scope.$watch('list', function (value) {
                    //     $scope.initMap();
                    // });
                });
            }
        };
    }]);
});
