define(function (require) {
    var module = require('../directives');
    module.directive("eChart", [function () {
        return {
            restrict: 'EA',
            scope: {
                options: '=',
                clickHandler: '&',
                mapSelected: '&'
            },
            replace: false,
            link: function ($scope, $elem, $attrs) {
                require(['common/directive/echartsRe/echartsRe'], function (echarts) {

                    var chart = echarts.init($elem[0]);

                    // chart.setOption($scope.options);
                    setTimeout(function () {
                        chart.setOption($scope.options);
                    }, 100);

                    chart.on(echarts.config.EVENT.CLICK, function (point) {
                        $scope.clickHandler({
                            point: point
                        });
                    });

                    chart.on(echarts.config.EVENT.MAP_SELECTED, function (param) {
                        $scope.$apply(function () {
                            $scope.mapSelected({param: param})
                        });
                    });

                    $scope.$watch('options', function (newValue, oldValue) {
                        chart.setOption($scope.options, true);
                    }, true)
                });
            }
        };
    }])
});