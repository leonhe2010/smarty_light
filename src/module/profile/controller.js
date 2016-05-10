define(function (require) {

    require('common/directive/echartsRe/directive');
    // require('common/directive/leftTree/directive');

    function Controller($scope, $location, $timeout, $http, util) {

        function initValue() {
            // $scope.demo = {};
            // $scope.locationSetted = '全国';
            // $scope.currentLevel = 0;
            // $scope.currentId = 0;
        }

        function bindEvent() {
            // $scope.demo.itemClicked = showLeftTree;
            $scope.$on('initLeftTree', function () {
                getLightInfo();
                getLightNum();
            });
        }

        function main() {
            initValue();
            bindEvent();
            getLightInfo();
            getLightNum();
            setTimeout(function () {
                $.each($('.text-field'), function (key, value) {
                    if ($(value).attr('pid') == $scope.currentPid) {
                        $(value).addClass('c_green');
                    }
                });
            }, 500);
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

        // function showLeftTree(item) {
        //     var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
        //     $scope.locationSetted = item.name;
        //     $scope.currentLevel = +pidArr.length;
        //     $scope.currentId = +item.id;

        //     $('.text-field').removeClass('c_green');
        //     $.each($('.text-field'), function (key, value) {
        //         if ($(value).attr('pid') == item.pid) {
        //             $(value).addClass('c_green');
        //         }
        //     });

        //     switch (pidArr.length) {
        //         case 1:
        //             if (!$scope.demo.tree[pidArr[0]]['children']) {
        //                 getChildNode(item.id, 2, item.pid);
        //             }
        //             break;
        //         case 2:
        //             if (!$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children']) {
        //                 getChildNode(item.id, 3, item.pid);
        //             }
        //             break;
        //         case 3:
        //             if (!$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children']) {
        //                 getChildNode(item.id, 4, item.pid);
        //             }
        //             break;
        //         case 4:
        //             break;
        //         default:
        //             ;
        //     }

        //     getLightInfo(pidArr.length, item.id);
        //     getLightNum(pidArr.length, item.id);

        //     // 1. 查找数据，如果没有重新请求
        //     // 2. 查找路灯信息
        // }

        // // 刷新列表
        // function setTreeDate(nodes, parentId, parentLevel, parentPid) {
        //     if (nodes.length === 0) {
        //         return;
        //     }
        //     if (parentLevel === 1) {
        //         $.each(nodes, function (index, value) {
        //             nodes[index].pid = index + 'l';
        //         });
        //         $scope.demo.tree = nodes;
        //     }
        //     else {
        //         $.each(nodes, function (index, value) {
        //             nodes[index].pid = parentPid + index + 'l';
        //         });

        //         var pidArr = parentPid.substr(0, parentPid.length - 1).split('l');
        //         if (pidArr.length === 1) {
        //             $scope.demo.tree[pidArr[0]]['children'] = nodes;
        //         }
        //         else if (pidArr.length === 2) {
        //             $scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'] = nodes;
        //         }
        //         else if (pidArr.length === 3) {
        //             $scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children'] = nodes;
        //         }
        //     }
        //     console.log($scope.demo.tree);
        // }

        // function getChildNode(id, level, pid) {
        //     var url = '/smartcity/api/get_child_node';

        //     var params = {
        //         id: +id,
        //         level: +level
        //     };

        //     $http.post(url, params).success(function (res) {
        //         if (res.status == 403) {
        //             $location.url('/login');
        //         }
        //         else if (res.data.result) {
        //             setTreeDate(res.data.nodes, id, level, pid);
        //         } 
        //         else {
        //             util.showMessage('获取信息失败！');
        //         }
        //     }).error(function (res) {
        //         util.showMessage('系统异常！');
        //     });
        // }

        function getLightInfo() {
            var params = {
                level: $scope.currentLevel,
                id: $scope.currentId
            };

            var url = '/smartcity/api/get_basic_info';

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.info = res.data;
                    initEchart(res.data.device);
                } 
                else {
                    util.showMessage(res.error);
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });

        }

        function initEchart(deviceData) {
            if (deviceData) {
                $scope.lightOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        textStyle: {color: '#848c97'},
                        data: ['打开个数', '关闭个数', '故障个数']
                    },
                    calculable: true,
                    color: ['#4ebf81', '#1f262e', '#fa2c2c'],
                    series: [
                        {
                            name: '路灯传感器信息',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            },
                            data: [
                                {value: deviceData.light.work, name: '打开个数'},
                                {value: deviceData.light.total - deviceData.light.work - deviceData.light.fault, name: '关闭个数'},
                                {value: deviceData.light.fault, name: '故障个数'}
                            ]
                        }
                    ]
                };
                $scope.ctrlOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        textStyle: {color: '#848c97'},
                        data: ['打开个数', '故障个数']
                    },
                    calculable: true,
                    color: ['#4ebf81', '#fa2c2c'],
                    series: [
                        {
                            name: '人群传感器信息',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            },
                            data: [
                                {value: deviceData.crowd.work, name: '打开个数'},
                                // {value: deviceData.crowd.total - deviceData.crowd.work - deviceData.crowd.fault, name: '关闭个数'},
                                {value: deviceData.crowd.fault, name: '故障个数'}
                            ]
                        }
                    ]
                };
                $scope.cameraOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        textStyle: {color: '#848c97'},
                        data: ['打开个数', '故障个数']
                    },
                    calculable: true,
                    color: ['#4ebf81', '#fa2c2c'],
                    series: [
                        {
                            name: '环境传感器信息',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            },
                            data: [
                                {value: deviceData.environment.work, name: '打开个数'},
                                // {value: deviceData.environment.total - deviceData.environment.work - deviceData.environment.fault, name: '关闭个数'},
                                {value: deviceData.environment.fault, name: '故障个数'}
                            ]
                        }
                    ]
                };
                $scope.sensorOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        textStyle: {color: '#848c97'},
                        data: ['打开个数', '故障个数']
                    },
                    calculable: true,
                    color: ['#4ebf81', '#fa2c2c'],
                    series: [
                        {
                            name: '车辆传感器信息',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            },
                            data: [
                                {value: deviceData.vehicle.work, name: '打开个数'},
                                // {value: deviceData.vehicle.total - deviceData.vehicle.work - deviceData.vehicle.fault, name: '关闭个数'},
                                {value: deviceData.vehicle.fault, name: '故障个数'}
                            ]
                        }
                    ]
                };
                $scope.wifiOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        textStyle: {color: '#848c97'},
                        data: ['打开个数', '故障个数']
                    },
                    calculable: true,
                    color: ['#4ebf81', '#fa2c2c'],
                    series: [
                        {
                            name: '声音传感器信息',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            },
                            data: [
                                {value: deviceData.voice.work, name: '打开个数'},
                                // {value: deviceData.voice.total - deviceData.voice.work - deviceData.voice.fault, name: '关闭个数'},
                                {value: deviceData.voice.fault, name: '故障个数'}
                            ]
                        }
                    ]
                };
            } else {
                util.showMessage('未获取设备数据！');
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', 'utilService'];

    return Controller;
});