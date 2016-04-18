define(function (require) {

    'use strict';

    var app = angular.module('app',
        // 依赖模块
        [
            'ngRoute',
            'ui.router',
            'ui.bootstrap',
            'app.directives',
            'app.filters',
            'app.services'
        ]);

    return app;
});