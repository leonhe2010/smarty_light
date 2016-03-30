define(function (require) {

    'use strict';

    var module = require('../directives');
    module.directive("paging", function () {
        return {
            restrict: 'AE',
            scope: {
                totalCount: '@',
                currentPage: '@',
                from: '@',
                size: '@'
            },
            template: ['',
                '   <div class="page-wrapper" ng-show="totalCount>0">',
                '       <pagination total-items="totalCount" class="pull-right" ng-model="currentPage"',
                '           items-per-page="{{size || $parent.pageSize || 20}}"',
                '           max-size="5"',
                '           boundary-links="true"',
                '           rotate="false"',
                '           previous-text="<"',
                '           next-text=">"',
                '           first-text="<<"',
                '           last-text=">>"',
                '           ng-change="changePage()"',
                '           align = "right">',
                '       </pagination>',
                '   </div>',
            ].join(''),
            link: function ($scope, $element, $attr) {
                $scope.hasPageSize = $attr.pageSize || false;
                $scope.pageSize = $scope.$parent.pageSize || 20;

                $scope.changePage = function () {
                    $scope.$emit('changepage', {
                        page: $scope.currentPage,
                        target: $element,
                        from: $attr.from || ''
                    });
                };
            }
        };
    });
});