define(function (require) {

    require('common/directive/echartsRe/directive');
    // require('common/directive/editLeftTree/directive');

    var us = require('underscore');

    function Controller($scope, $location, $timeout, $http, $modal, util, $rootScope) {

        function initValue() {
            console.log($rootScope.isSetPage());
            // $scope.demo = {};
            $scope.setPtn = 1;
            // $scope.locationSetted = '全国';
            // $scope.currentLevel = 0;
            // $scope.currentId = 0;
            $scope.lightOptions = null;
            // $scope.currentParentId = 0;
            $scope.unLightOptions = null;
            $scope.lightIds = [];
        }

        function bindEvent() {
            // $scope.demo.itemClicked = {};
            // $scope.demo.itemClicked = showLeftTree;
            $rootScope.demo.addItem = addItem;
            $rootScope.demo.minusItem = minusItem;
            $scope.addLightGroup = addLightGroup;
            $scope.postEquipment = postEquipment;
            $scope.addGroup = addGroup;
            $scope.setLightIds = setLightIds;
            $scope.$on('initLeftTree', function () {
                getEquipmentList();
            });
        }

        function main() {
            // location.reload();
            initValue();
            bindEvent();
            if ($scope.currentLevel != 0) {
                getEquipmentList();
            }
            setTimeout(function () {
                $.each($('.text-field'), function (key, value) {
                    if ($(value).attr('pid') == $scope.currentPid) {
                        $(value).addClass('c_green');
                    }
                });
            }, 500);
            // getChildNode(0, 1);
        }

        function minusItem(pid, e) {
            e.stopPropagation();

            var deleteModal = $modal.open({
                templateUrl: 'src/module/set/deleteUnit.html',
                scope: $scope,
            });

            var unitLevel = 0;
            var unitId = 0;
            if (pid) {
                var pidArr = pid.substr(0, pid.length - 1).split('l');
                unitLevel = +pidArr.length;
                unitId = +pidArr[pidArr.length - 1];

                switch (pidArr.length) {
                    case 2:
                        $scope.unitType = '城市';
                        break;
                    case 3:
                        $scope.unitType = '路灯集';
                        break;
                    case 4:
                        $scope.unitType = '分组';
                        break;
                    case 1:
                        $scope.unitType = '省份';
                        break;
                    default:
                        return;
                }
            }
            else {
                return;
            }

            $scope.deleteUnit = function () {
                var url = '';
                var params = {
                    operation: 1
                };

                if (pid) {
                    var pidArr = pid.substr(0, pid.length - 1).split('l');

                    switch (pidArr.length) {
                        case 2:
                            url = '/smartcity/api/change_city';
                            params.city_id = unitId;
                            break;
                        case 3:
                            url = '/smartcity/api/change_district';
                            params.district_id = unitId;
                            break;
                        case 4:
                            url = '/smartcity/api/change_group';
                            params.group_id = unitId;
                            break;
                        case 1:
                            url = '/smartcity/api/change_province';
                            params.province_id = unitId;
                            break;
                        default:
                            return;
                    }
                }

                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        util.showMessage('删除成功！');
                        deleteModal.close();
                        console.log($scope.demo.tree);
                        if (unitLevel > 1) {
                            var pos = pid.lastIndexOf(unitId + 'l');
                            var prtPid = pid.substring(0, pos);
                            var prtIdArr = prtPid.substr(0, prtPid.length - 1).split('l');
                            var prtId = prtIdArr[prtIdArr.length - 1];
                            getChildNode(prtId, unitLevel, prtPid);
                        }
                        else {
                            getChildNode(0, 1);
                        }
                        console.log($scope.demo.tree);
                    } 
                    else {
                        util.showMessage('删除失败！');
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });
            };

            $scope.closeDeleteModal = function () {
                deleteModal.close();
            };
        }

        function addItem(pid, e) {
            e.stopPropagation();

            var unitDialog = $modal.open({
                templateUrl: 'src/module/set/addUnit.html',
                scope: $scope,
            });

            var unitLevel = 0;
            var unitId = 0;
            if (pid) {
                var pidArr = pid.substr(0, pid.length - 1).split('l');
                unitLevel = +pidArr.length;
                unitId = +pidArr[pidArr.length - 1];

                switch (pidArr.length) {
                    case 1:
                        $scope.unitType = '城市名称';
                        break;
                    case 2:
                        $scope.unitType = '路灯集名称'
                        break;
                    case 3:
                        $scope.unitType = '分组名称'
                        break;
                    default:
                        return;
                }
            }
            else {
                $scope.unitType = '省份名称'
            }

            $scope.postUnit = function () {
                if (!$scope.unitName) {
                    util.showMessage('请输入' + $scope.unitType);
                    return;
                }

                var url = '';
                var params = {
                    operation: 0
                };

                if (pid) {
                    var pidArr = pid.substr(0, pid.length - 1).split('l');

                    switch (pidArr.length) {
                        case 1:
                            url = '/smartcity/api/change_city';
                            params.city_name = $scope.unitName;
                            params.province_id = unitId;
                            break;
                        case 2:
                            url = '/smartcity/api/change_district';
                            params.district_name = $scope.unitName;
                            params.city_id = unitId;
                            break;
                        case 3:
                            url = '/smartcity/api/change_group';
                            params.group_name = $scope.unitName;
                            params.district_id = unitId;
                            break;
                        default:
                            return;
                    }
                }
                else {
                    url = '/smartcity/api/change_province';
                    params.province_name = $scope.unitName;
                    params.country_id = unitId;
                }

                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        util.showMessage('添加成功！');
                        $scope.unitName = null;
                        unitDialog.close();
                        getChildNode(unitId, unitLevel + 1, pid);
                    } 
                    else {
                        util.showMessage('添加失败！');
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });
            };

            $scope.closeAddModal = function () {
                unitDialog.close();
            };
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

        function setLightIds(event) {
            var ele = $(event.target);
            if (ele.is(':checked')) {
                $scope.lightIds.push(+ele.attr('lid'));
            }
            else {
                $scope.lightIds.splice($.inArray(+ele.attr('lid'), $scope.lightIds), 1);
            }
        }

        function addLightGroup() {
            var url = '/smartcity/api/get_light_group';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel
            };
            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.lightOptions = res.data.set;
                    openLightListModal();
                } 
                else {
                    util.showMessage('获取路灯失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function getLightList() {
            var url = '/smartcity/api/get_light_group';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel
            };
            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.lightOptions = res.data.set;
                } 
                else {
                    util.showMessage('获取路灯失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        function openLightListModal() {
            var dialog = $modal.open({
                templateUrl: 'src/module/set/lightList.html',
                scope: $scope,
            });

            $scope.deleteLight = function (lightId) {
                var url = '/smartcity/api/delete_light';
                var params = {
                    id: +lightId
                };
                $http.post(url, params).success(function (res) {
                    if (res.status == 403) {
                        $location.url('/login');
                    }
                    else if (res.data.result) {
                        util.showMessage('删除成功！');
                        getLightList();
                    } 
                    else {
                        util.showMessage(res.error);
                    }
                }).error(function (res) {
                    util.showMessage('系统异常！');
                });
            };

            $scope.editLight = function (lightInfo) {
                var editDialog;

                if (lightInfo) {
                    $scope.lightNameIN = lightInfo.lightName;
                    $scope.lightLngIN = lightInfo.lightLng;
                    $scope.lightLatIN = lightInfo.lightLat;
                    $scope.isEdit = true;

                    editDialog = $modal.open({
                        templateUrl: 'src/module/set/addLight.html',
                        scope: $scope
                    });
                }
                else {
                    $scope.isEdit = false;
                    var newLightUrl = '/smartcity/api/get_undistricted_light';
                    $http.post(newLightUrl, {}).success(function (res) {
                        if (res.status == 403) {
                            $location.url('/login');
                        }
                        else if (res.data.result) {
                            $scope.newLightOptions = res.data.light;
                            editDialog = $modal.open({
                                templateUrl: 'src/module/set/addLight.html',
                                scope: $scope
                            });
                        } 
                        else {
                            util.showMessage(res.error);
                        }
                    }).error(function (res) {
                        util.showMessage('系统异常！');
                    });
                }

                $scope.closeEditLight = function () {
                    editDialog.close();
                };

                $scope.postLightInfo = function () {
                    if (!$scope.lightNameIN || !$scope.lightLngIN || !$scope.lightLatIN) {
                        util.showMessage('请填写完整的路灯信息！');
                        return;
                    }
                    var url = '';
                    var params = {};
                    if ($scope.isEdit) {
                        url = '/smartcity/api/edit_light';
                        params = {
                            id: +lightInfo.lightId,
                            lightName: +$scope.lightNameIN,
                            lightLng: +$scope.lightLngIN,
                            lightLat: +$scope.lightLatIN
                        };
                    }
                    else if ($scope.currentLevel == 3) {
                        url = '/smartcity/api/add_light_to_district';
                        params = {
                            districtId: $scope.currentId,
                            // level: $scope.currentLevel,
                            lightId: +$scope.lightNameIN,
                            lightLng: $scope.lightLngIN,
                            lightLat: $scope.lightLatIN
                        };
                    }
                    else if ($scope.currentLevel == 4) {
                        url = '/smartcity/api/add_light_to_group';
                        params = {
                            groupId: $scope.currentId,
                            // level: $scope.currentLevel,
                            lightId: +$scope.lightNameIN,
                            lightLng: $scope.lightLngIN,
                            lightLat: $scope.lightLatIN
                        };
                    }
                    
                    $http.post(url, params).success(function (res) {
                        if (res.status == 403) {
                            $location.url('/login');
                        }
                        else if (res.data.result) {
                            util.showMessage('添加成功！');
                            $scope.closeEditLight();
                            getLightList();
                        } 
                        else {
                            util.showMessage('添加失败！');
                        }
                    }).error(function (res) {
                        util.showMessage('系统异常！');
                    });
                };

            };

            $scope.cancel = function () {
                dialog.close();
            };
        }

        function getEquipmentList() {
            var url = '/smartcity/api/get_sampling_frequency';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel
            };

            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    $scope.equipmentList = res.data.set
                } 
                else {
                    util.showMessage('获取设置采样率失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
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

        function initEquipment() {
            $scope.equipmentFrequency = null;
            $scope.equipmentType = null;
        }

        function postEquipment() {
            if (!$scope.equipmentType) {
                util.showMessage('请选择设备类型！');
                return;
            }

            if (!$scope.equipmentFrequency || !$.isNumeric($scope.equipmentFrequency)) {
                util.showMessage('请输入正确的采样时间频率！');
                return;
            }

            var url = '/smartcity/api/set_sampling_frequency';
            var params = {
                id: $scope.currentId,
                level: $scope.currentLevel,
                frequency: +$scope.equipmentFrequency,
                type: +$scope.equipmentType
            };


            $http.post(url, params).success(function (res) {
                if (res.status == 403) {
                    $location.url('/login');
                }
                else if (res.data.result) {
                    util.showMessage('设置成功！');
                    initEquipment();
                    getEquipmentList();
                } 
                else {
                    util.showMessage('设置失败！');
                }
            }).error(function (res) {
                util.showMessage('系统异常！');
            });
        }

        // function showLeftTree(item) {
        //     $scope.locationSetted = item.name;
        //     var pidArr = item.pid.substr(0, item.pid.length - 1).split('l');
        //     $scope.currentLevel = +pidArr.length;
        //     $scope.currentId = +item.id;

        //     $('.text-field').removeClass('c_green');
        //     $.each($('.text-field'), function (key, value) {
        //         if ($(value).attr('pid') == item.pid) {
        //             $(value).addClass('c_green');
        //         }
        //     });

        //     if (pidArr.length > 1) {
        //         $scope.currentParentId = +pidArr[pidArr.length - 2];
        //     }

        //     if (pidArr.length < 4) {
        //         getChildNode(item.id, pidArr.length + 1, item.pid);
        //     }
        //     getEquipmentList();
        // }

        // 刷新列表
        // function setTreeDate(nodes, parentId, parentLevel, parentPid) {
        //     // if (nodes.length === 0) {
        //     //     return;
        //     // }
        //     if (parentLevel === 1) {
        //         $.each(nodes, function (index, value) {
        //             nodes[index].pid = nodes[index].id + 'l';
        //         });
        //         $scope.demo.tree = nodes;
        //     }
        //     else {
        //         $.each(nodes, function (index, value) {
        //             nodes[index].pid = parentPid + nodes[index].id + 'l';
        //         });
        //         var pidArr = parentPid.substr(0, parentPid.length - 1).split('l');
        //         if (pidArr.length === 1) {
        //             us.findWhere($scope.demo.tree, {id: pidArr[0]})['children'] = nodes;
        //         }
        //         else if (pidArr.length === 2) {
        //             us.findWhere(us.findWhere($scope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'] = nodes;
        //         }
        //         else if (pidArr.length === 3) {
        //             $.each(nodes, function (index, value) {
        //                 nodes[index]['addShow'] = true;
        //             });
        //             us.findWhere(us.findWhere(us.findWhere($scope.demo.tree, {id: pidArr[0]})['children'], {id: pidArr[1]})['children'], {id: pidArr[2]})['children'] = nodes;
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

        main();
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http', '$modal', 'utilService', '$rootScope'];

    return Controller;
});
