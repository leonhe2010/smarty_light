define(function(require) {
    
    'use strict';

    // 依赖加载
    // require('bootstrap');
    require('ngRoute');
    require('validation');
    require('underscore');
    require('uiRoute');
    require('common/filter/filter');
    // require('cookie');
    // require('./main.tpl');

    var main = require('module/entry/mainController');
    var routeConfig = require('./routeConfig');
    var app = require('./app');
    // require('common/services');

    app.run(['$rootScope', '$location', 
        function($rootScope, $location) {

        }
    ]).config(['$routeProvider', '$stateProvider',
        function($routeProvider, $stateProvider) {
            // var tag = $.cookie('CAS_AC_CURRENT_ROLE');
            var tag = '';
            var isAdmin = tag == 'yunying_kefu_admin';
            var routes = [];

            // 路由配置
            for (var i = 0, item; item = routeConfig[i++];) {
                if (item.stateProvider) {
                    $stateProvider.state(item.name, item);
                }
                $routeProvider.when(item.path, {
                    templateUrl: item.tplUrl,
                    controller: item.controller
                });

                routes.push(item);
            }

            var defaultRoute = isAdmin ? '/commissioner/admin' : routes[0].path;
            $routeProvider.otherwise({
                redirectTo: defaultRoute
            });

            $(window).bind('beforeunload', function() {
                // return '确定离开此页面吗？';
            });
        }
    ]).config(['$httpProvider', '$sceDelegateProvider',
        function($httpProvider, $sceDelegateProvider) {

            $httpProvider.defaults.headers.post = {
                'Content-Type': 'application/json'
            };
        }
    ]);

    // 注册controller
    app.controller('mainController', main);

    return app;
});