define(function (require) {

    require('common/directive/echartsRe/directive');
    var config = require('../config');
    var lightCtrl = require('module/geography/light');

    function Controller($scope, $location, $timeout, $http, $modal, util) {

        function initValue() {
            $scope.setPtn = 2;
            $scope.isDrag = false;
            $scope.ox = 0;
            $scope.left = 0;
            $scope.brightness = 0;
            $scope.unLightOptions = null;
            $scope.lightIds = [];
            // $scope.currentParentId = 0;
            $scope.lightCtrlOptions = config.lightCtrlOptions;
            $scope.lightCtrl = 6;
        }

        function bindEvent() {
            $scope.$on('initLeftTree', function () {
                getLightNum();
                if ($scope.setPtn === 2) {
                    getSettedPlan();
                }
            });
            $scope.switchPtn = switchPtn;
            $scope.postPtn = postPtn;
            $scope.dragBtn = dragBtn;
            $scope.releaseBtn = releaseBtn;
            $scope.calculateWidth = calculateWidth;
            $scope.deletePlan = deletePlan;
            $scope.addGroup = addGroup;
            $scope.setLightIds = setLightIds;
            $scope.changeLightCtrl = changeLightCtrl;
            $scope.$on('singleLight', function (event, data) {
                openLightModal(data);
            });
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

        function main() {
            initValue();
            bindEvent();
            getLightNum();
            if ($scope.currentLevel != 0) {
                getSettedPlan();
            }
            setTimeout(function () {
                $.each($('.text-field'), function (key, value) {
                    if ($(value).attr('pid') == $scope.currentPid) {
                        $(value).addClass('c_green');
                    }
                });
            }, 500);
        }

        function changeLightCtrl() {
            $scope.duration = null;
            initBrightness();

            if ($scope.setPtn == 2) {
                getSettedPlan();
            }

        }

        function setLightIds(event) {
            var ele = $(event.target);
            if (ele.is(':checked')) {
                $scope.lightIds.push(+ele.attr('lid'));
            }
            else {
                $scope.lightIds.splice($.inArray(+ele.attr('lid'), $scope.lightIds), 1);
            }
        }

        function addGroup() {
            var url = '/smartcity/api/get_ungrouped_light';
            var params = {id: $scope.currentParentId};
            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.unLightOptions = res.data.light;
                    if ($scope.unLightOptions.length != 0) {
                        openAddModal();
                    }
                    else {
                        util.showMessage('没有未分组路灯！');
                    }
                } 
                else {
                    util.showMessage('获取路灯失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function openAddModal() {
            var dialog = $modal.open({
                templateUrl: 'src/module/manipulation/addLight.html',
                scope: $scope,
            });

            $scope.ok = function (event) {

                if ($scope.lightIds.length == 0) {
                    util.showMessage('请选择路灯！');
                    return;
                }

                var url = '/smartcity/api/group_light';
                var params = {
                    lightIds: $scope.lightIds,
                    id: $scope.currentId
                };
                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        util.showMessage('添加成功！');
                        dialog.close();
                    } 
                    else {
                        util.showMessage('添加失败！');
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });

            };

            $scope.cancel = function () {
                $scope.lightIds = [];
                dialog.close();
            };
        }

        // ???
        function deletePlan(index) {
            if ($($('.edit-btn')[index]).html() == '编辑') {
                $('.edit-btn').attr('disabled', 'disabled');
                $($('.edit-btn')[index]).attr('disabled', false);
                $($('.edit-btn')[index]).removeClass('btn-primary');
                $($('.edit-btn')[index]).addClass('btn-success');
                $($('.edit-btn')[index]).html('保存');
                $scope.isEditPlan = true;
            }
            else {
                // addPlan(index);
                if (!$.isNumeric($scope.endHour) || !$.isNumeric($scope.endMinute)) {
                    util.showMessage('请输入正确的时间！');
                    return;
                }
                var endDate = +$scope.endHour * 60 + (+$scope.endMinute);
                if (endDate < $scope.settedPlan[index]['start']) {
                    util.showMessage('结束时间不能小于开始时间！');
                    return;
                }
                $scope.settedPlan[index]['end'] = endDate;
                if ($scope.lightCtrl === 6) {
                    $scope.settedPlan[index]['brightness'] = +$scope.brightness;
                }
                else {
                    $scope.settedPlan[index]['brightness'] = +$scope.onOff;
                }
                
                if (index < 4) {
                    $scope.settedPlan[index + 1]['start'] = endDate;
                }
                $scope.tableLevel = $scope.currentLevel;
                initBrightness();
                $scope.onOff = null;
                $('.edit-btn').attr('disabled', false);
                $($('.edit-btn')[index]).removeClass('btn-success');
                $($('.edit-btn')[index]).addClass('btn-primary');
                $($('.edit-btn')[index]).html('编辑');
                $scope.isEditPlan = false;
            }

            // var url = '/smartcity/api/set_light_plan';
            // var params = {
            //     id: $scope.currentId,
            //     level: $scope.currentLevel,
            //     plans: [],
            //     type: $scope.lightCtrl
            // };
            // $.extend(true, params.plans, $scope.settedPlan);
            // params.plans.pop();

            // $http.post(url, params).success(function (res) {
            //     if (res.status == 403) {
            //         $location.url('/login');
            //     }
            //     else if (res.data.result) {
            //         util.showMessage('删除成功！');
            //         getSettedPlan();
            //     } 
            //     else {
            //         util.showMessage('获取已设置计划模式失败！');
            //     }
            // }).error(function (res) {
            //     util.showMessage('系统异常！');
            // });
        }

        function dragBtn(event) {
            // $scope.lx = $(event.target).offset().left;
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

        function getSettedPlan() {
            var url = '/smartcity/api/get_light_plan';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel,
                type: $scope.lightCtrl
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    initTableData(res.data.plans);
                    // $scope.settedPlan = res.data.plans;
                    // $scope.planData = [];
                    // $.extend(true, $scope.planData, $scope.settedPlan);
                    $scope.tableLevel = res.data.level;
                    // if ($scope.planData.length > 0) {
                    //     $scope.planData[$scope.planData.length - 1].isLastItem = true;
                    // }
                    initInputValue();
                } 
                else {
                    util.showMessage('获取已设置计划模式失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function initTableData(data) {
            var len = data.length;
            var i = 0;
            var j = 4 - len;
            $scope.settedPlan = data;

            switch (len) {
                case 0:
                    $scope.settedPlan.push({
                        start: 0, 
                        end: 1440, 
                        brightness: 0
                    });
                    for (i = 0; i < j; i++) {
                        $scope.settedPlan.push({
                            start: 1440, 
                            end: 1440, 
                            brightness: 0
                        });
                    }
                    break;
                case 1:
                    $scope.settedPlan.push({
                        start: data[len - 1]['end'], 
                        end: 1440, 
                        brightness: 0
                    });
                    for (i = 0; i < j; i++) {
                        $scope.settedPlan.push({
                            start: 1440, 
                            end: 1440, 
                            brightness: 0
                        });
                    }
                    break;
                case 2:
                    $scope.settedPlan.push({
                        start: data[len - 1]['end'], 
                        end: 1440, 
                        brightness: 0
                    });
                    for (i = 0; i < j; i++) {
                        $scope.settedPlan.push({
                            start: 1440, 
                            end: 1440, 
                            brightness: 0
                        });
                    }
                    break;
                case 3:
                    $scope.settedPlan.push({
                        start: data[len - 1]['end'], 
                        end: 1440, 
                        brightness: 0
                    });
                    for (i = 0; i < j; i++) {
                        $scope.settedPlan.push({
                            start: 1440, 
                            end: 1440, 
                            brightness: 0
                        });
                    }
                    break;
                case 4:
                    $scope.settedPlan.push({
                        start: data[len - 1]['end'], 
                        end: 1440, 
                        brightness: 0
                    });
                    break;
                case 5:
                    break;
                default:
                    util.showMessage('系统异常！');
            }

            $scope.timeStap = [];
            var k = 0;
            for (k = 0; k < 5; k++) {
                $scope.timeStap.push($scope.settedPlan[k]['end']);
            }
        }

        function initInputValue() {
            $scope.endHour = null;
            $scope.endMinute = null;
            // if ($scope.settedPlan.length === 0) {
            //     $scope.startHour = 0;
            //     $scope.startMinute = 0;
            //     $scope.endHour = null;
            //     $scope.endMinute = null;
            //     $scope.isLastPlan = false;
            //     // $scope.isFullPlan = false;
            // }
            // else if ($scope.settedPlan.length === 4) {
            //     var timeVal = $scope.settedPlan[$scope.settedPlan.length - 1].end;
            //     $scope.startHour = Math.floor(timeVal / 60);
            //     $scope.startMinute = Math.floor(timeVal % 60);
            //     $scope.endHour = 24;
            //     $scope.endMinute = 0;
            //     $scope.isLastPlan = true;
            //     // $scope.isFullPlan = false;
            // }
            // else if ($scope.settedPlan.length === 5) {
            //     $scope.startHour = null;
            //     $scope.startMinute = null;
            //     $scope.endHour = null;
            //     $scope.endMinute = null;
            //     $scope.isLastPlan = false;
            //     // $scope.isFullPlan = true;
            // }
            // else {
            //     var timeVal = $scope.settedPlan[$scope.settedPlan.length - 1].end;
            //     $scope.startHour = Math.floor(timeVal / 60);
            //     $scope.startMinute = Math.floor(timeVal % 60);
            //     $scope.endHour = null;
            //     $scope.endMinute = null;
            //     $scope.isLastPlan = false;
            //     // $scope.isFullPlan = false;
            // }
        }

        // ???
        function postPtn() {
            var url = '';
            var params = {};
            if ($scope.setPtn === 1) {
                url = '/smartcity/api/set_light_manual';
                params = {
                    id: $scope.currentId,
                    level: $scope.currentLevel,
                    brightness: $scope.brightness,
                    duration: +$scope.duration,
                    type: $scope.lightCtrl
                };

                if ($scope.lightCtrl !== 6) {
                    params.brightness = +$scope.onOff;
                }
            }
            else if ($scope.setPtn === 2) {
                if (
                    $scope.settedPlan[0]['start'] > $scope.settedPlan[0]['end']
                    || $scope.settedPlan[1]['start'] > $scope.settedPlan[1]['end']
                    || $scope.settedPlan[2]['start'] > $scope.settedPlan[2]['end']
                    || $scope.settedPlan[3]['start'] > $scope.settedPlan[3]['end']
                    || $scope.settedPlan[4]['start'] > $scope.settedPlan[4]['end']
                    || $scope.settedPlan[4]['end'] !== 1440
                    ) {
                    util.showMessage('请设置正确的计划模式！');
                    return;
                }
                url = '/smartcity/api/set_light_plan';
                params = {
                    id: $scope.currentId,
                    level: $scope.currentLevel,
                    plans: [],
                    type: $scope.lightCtrl
                };
                $.extend(true, params.plans, $scope.settedPlan);

                // var planObj = {
                //     start: ((+$scope.startHour) * 60 + (+$scope.startMinute)),
                //     end: ((+$scope.endHour) * 60 + (+$scope.endMinute)),
                //     brightness: $scope.brightness
                // };

                // if ($scope.lightCtrl !== 6) {
                //     planObj.brightness = +$scope.onOff;
                // }

                // params.plans.push(planObj);
            }


            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    util.showMessage('设置成功！');
                    initBrightness();

                    $scope.onOff = null;
                    
                    if ($scope.setPtn === 1) {
                        $scope.duration = null;
                    }
                    else if ($scope.setPtn === 2) {
                        getSettedPlan();
                    }

                    $scope.demo.itemClicked({
                        name: $scope.locationSetted,
                        id: $scope.currentId,
                        level: $scope.currentLevel,
                        pid: $scope.currentPid
                    });
                } 
                else {
                    util.showMessage('设置失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function switchPtn(event) {
            $scope.setPtn = +$(event.target).attr('ptn');
            $scope.lightCtrl = 6;
            if ($scope.setPtn === 2) {
                getSettedPlan();
            }
        }

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal', 'utilService'];

    return Controller;
});
