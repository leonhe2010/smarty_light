define(function (require) {

    require('common/directive/echartsRe/directive');
    require('common/directive/leftTree/directive');

    function Controller($scope, $location, $timeout, $http, $modal) {

        function initValue() {
            $scope.demo = {};
            $scope.setPtn = 1;
            $scope.locationSetted = '全国';
            $scope.currentLevel = 0;
            $scope.currentId = 0;
            $scope.isDrag = false;
            $scope.ox = 0;
            // $scope.lx = 0;
            $scope.left = 0;
            // $scope.bgleft = 0;
            $scope.brightness = 0;
            $scope.lightOptions = null;
            $scope.lightIds = [];
            $scope.currentParentId = 0;
        }

        function bindEvent() {
            $scope.demo.itemClicked = showLeftTree;
            $scope.switchPtn = switchPtn;
            $scope.postPtn = postPtn;
            $scope.dragBtn = dragBtn;
            $scope.releaseBtn = releaseBtn;
            $scope.calculateWidth = calculateWidth;
            $scope.deletePlan = deletePlan;
            $scope.addGroup = addGroup;
            $scope.setLightIds = setLightIds;
        }

        function main() {
            initValue();
            bindEvent();
            getChildNode(0, 1);
        }

        // function initPlanPtnInput() {
        //     $scope.startHour = null;
        //     $scope.startMinute = null;
        //     $scope.endHour = null;
        //     $scope.endMinute = null;
        //     $scope.isLastPlan = false;
        //     $scope.isFullPlan = false;
        // }

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
                if (res.data.result) {
                    $scope.lightOptions = res.data.light;
                    if ($scope.lightOptions.length != 0) {
                        openAddModal();
                    }
                    else {
                        alert('没有未分组路灯！');
                    }
                } else {
                    alert('获取路灯失败！');
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        }

        function openAddModal() {
            var dialog = $modal.open({
                templateUrl: 'src/module/manipulation/addLight.html',
                scope: $scope,
            });

            $scope.ok = function (event) {

                if ($scope.lightIds.length == 0) {
                    alert('请选择路灯！');
                    return;
                }

                var url = '/smartcity/api/add_light_ungrouped';
                var params = {
                    lightIds: $scope.lightIds,
                    id: $scope.currentId
                };
                $http.post(url, params).success(function (res) {
                    if (res.data.result) {
                        alert('添加成功！');
                        dialog.close();
                    } else {
                        alert('添加失败！');
                    }
                }).error(function (res) {
                    alert('系统异常！');
                });
                
            };

            $scope.cancel = function () {
                dialog.close();
            };
        }

        function deletePlan(planId) {
            var url = '/smartcity/api/set_light_plan';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel,
                plans: []
            };
            $.extend(true, params.plans, $scope.settedPlan);
            params.plans.pop();

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    alert('删除成功！');
                    getSettedPlan();
                } else {
                    alert('获取已设置计划模式失败！');
                }
            }).error(function (res) {
                alert('系统异常！');
            });
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
                if ($scope.left > 700){
                    $scope.left = 700;
                }
                $('#bt').css('left', $scope.left);
                $('#bgcolor').width($scope.left);
                $scope.brightness = parseInt($scope.left / 6.9);
                $('#text').html(parseInt($scope.left / 6.9));
            }
        }

        function initBrightness() {
            $scope.ox = 0;
            $scope.left = 0;
            $('#bt').css('left', $scope.left);
            $('#bgcolor').width($scope.left);
            $scope.brightness = parseInt($scope.left / 6.9);
            $('#text').html(parseInt($scope.left / 6.9));
        }

        function getSettedPlan() {
            var url = '/smartcity/api/get_light_plan';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel
            };

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    $scope.settedPlan = res.data.plans;
                    $scope.planData = [];
                    $.extend(true, $scope.planData, $scope.settedPlan);
                    $scope.tableLevel = res.data.level;
                    if ($scope.planData.length > 0) {
                        $scope.planData[$scope.planData.length - 1].isLastItem = true;
                    }
                    initInputValue();
                } else {
                    alert('获取已设置计划模式失败！');
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        }
        
        function initInputValue() {
            if ($scope.settedPlan.length === 0) {
                $scope.startHour = 0;
                $scope.startMinute = 0;
                $scope.endHour = null;
                $scope.endMinute = null;
                $scope.isLastPlan = false;
                $scope.isFullPlan = false;
            }
            else if ($scope.settedPlan.length === 4) {
                var timeVal = $scope.settedPlan[$scope.settedPlan.length - 1].end;
                $scope.startHour = Math.floor(timeVal / 60);
                $scope.startMinute = Math.floor(timeVal % 60);
                $scope.endHour = 24;
                $scope.endMinute = 0;
                $scope.isLastPlan = true;
                $scope.isFullPlan = false;
            }
            else if ($scope.settedPlan.length === 5) {
                $scope.startHour = null;
                $scope.startMinute = null;
                $scope.endHour = null;
                $scope.endMinute = null;
                $scope.isLastPlan = false;
                $scope.isFullPlan = true;
            }
            else {
                var timeVal = $scope.settedPlan[$scope.settedPlan.length - 1].end;
                $scope.startHour = Math.floor(timeVal / 60);
                $scope.startMinute = Math.floor(timeVal % 60);
                $scope.endHour = null;
                $scope.endMinute = null;
                $scope.isLastPlan = false;
                $scope.isFullPlan = false;
            }
        }

        function postPtn() {
            var url = '';
            var params = {};
            if ($scope.setPtn === 1) {
                url = '/smartcity/api/set_light_manual';
                params = {
                    id: $scope.currentId,
                    level: $scope.currentLevel,
                    brightness: $scope.brightness
                };
            }
            else if ($scope.setPtn === 2) {
                url = '/smartcity/api/set_light_plan';
                params = {
                    id: $scope.currentId,
                    level: $scope.currentLevel,
                    plans: []
                };
                $.extend(true, params.plans, $scope.settedPlan);
                params.plans.push({
                    start: ((+$scope.startHour) * 60 + (+$scope.startMinute)),
                    end: ((+$scope.endHour) * 60 + (+$scope.endMinute)),
                    brightness: $scope.brightness
                });
            }

            $http.post(url, params).success(function (res) {
                if (res.data.result) {
                    alert('设置成功！');
                    initBrightness();

                    if ($scope.setPtn === 2) {
                        getSettedPlan();
                    }
                } else {
                    alert('设置失败！');
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        }

        function switchPtn(event) {
            $scope.setPtn = +$(event.target).attr('ptn');
            if ($scope.setPtn === 2) {
                getSettedPlan();
            }
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
                    $scope.currentParentId = +$scope.demo.tree[pidArr[0]]['id'];
                    break;
                case 3:
                    if (!$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children']) {
                        getChildNode(item.id, 4, item.pid);
                    }
                    $scope.currentParentId = +$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['id'];
                    setTimeout(function () {
                        $scope.lightOptions = $scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['children'];
                    });
                    break;
                case 4:
                    $scope.currentParentId = +$scope.demo.tree[pidArr[0]]['children'][pidArr[1]]['children'][pidArr[2]]['id'];
                    break;
                default:
                    ;
            }
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

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal'];

    return Controller;
});
