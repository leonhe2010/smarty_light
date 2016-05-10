define(function (require) {

    'use strict';

    var module = require('../directives');


    module.directive('editTreeView', [function () {

        return {
            restrict: 'E',
            templateUrl: 'src/common/directive/editLeftTree/editTreeView.html',
            scope: {
                treeData: '=',
                canChecked: '=',
                // showOper: '=',
                textField: '@',
                itemClicked: '&',
                itemCheckedChanged: '&',
                addItem: '&',
                minusItem: '&',
                itemTemplateUrl: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.itemExpended = function (item, $event) {
                    item.$$isExpend = !item.$$isExpend;
                    $event.stopPropagation();
                };

                $scope.addItemHandler = function (item, event) {
                    $scope.addItem({
                        item: item,
                        e: event
                    });

                };

                $scope.minusItemHandler = function (item, event) {
                    $scope.minusItem({
                        item: item,
                        e: event
                    });
                };

                $scope.getItemIcon = function (item) {
                    var isLeaf = $scope.isLeaf(item);

                    if (isLeaf) {
                        return 'fa fa-leaf';
                    }

                    return item.$$isExpend ? 'fa fa-minus' : 'fa fa-plus';
                };

                $scope.isLeaf = function (item) {
                    return !item.children || !item.children.length;
                };

                $scope.warpCallback = function (callback, item, $event) {
                    ($scope[callback] || angular.noop)({
                        $item: item,
                        $event: $event
                    });
                };
            }],
            link: function(scope, iElement, iAttrs) {
                if (iAttrs.showoper === 'true') {
                    scope.showOper = true;
                }
                else {
                    scope.showOper = false;
                }
            } 
        };
    }]);

});