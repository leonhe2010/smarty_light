/**
 * @file 发送请求服务
 */

define(function (require) {
    'use strict';

    // var util = require('./util');
    require('../module/app');
    /**
     * 处理错误信息
     */
    function processRequrestFailed(error) {
        if (!$('#alert-dialog').length) {
            var msg = (error && error.message) || '系统异常';
            // util.alert({
            //     msg: msg
            // });
        }
    }

    angular.module('app.services', [])
        .factory('ajaxService', ['$http',
            function ($http) {
                var doRequest = function (path, param) {
                    var defer = $.Deferred();
                    var config = {
                        method: param.method || 'POST',
                        url: path
                    };
                param.method == 'GET' ? (config.params = param.data) 
                    : (config.data = param.data); 
                    $http(config).success(function (data) {
                        if (data.status == 200) {
                            defer.resolve(data);
                            param.successHandler && param.successHandler(data);
                        } else if (data.status == 500) {
                            defer.reject();
                            processRequrestFailed({
                                message: '系统异常'
                            });
                        } else if (data.status == 700) {
                            window.location.href = '/main.do';
                        } else if (data.status == 400) {
                            defer.reject();
                            if (param.failHandler) {
                                param.failHandler(data);
                            } else {
                                processRequrestFailed(data.error);
                            }
                        } else if (data.status == 800) {
                            processRequrestFailed({
                                message: '无权限操作'
                            });
                        } else {
                            defer.reject(data);
                            param.failHandler && param.failHandler(data);
                        }
                    }).error(function (error, status) {
                        if (status == 0) {
                            window.location.reload();
                            return;
                        }
                        if (status == 302 || status == 403) {
                            window.location.href = '/main.do';
                        }
                        defer.reject();
                        processRequrestFailed({
                            message: '系统异常'
                        });
                    });
                    return defer;
                };
                
                return {
                    /**
                     * 发送请求
                     * @param {string} path 请求的path
                     * @param {Object} param 请求的参数
                     */
                    send: function (path, param, loading) {
                        var loading = loading || false;
                        // <div id="loading" ng-if="!loaded">
                        //     <span>LOADING</span>
                        // </div>
                        // $('.business-wrapper').append('Some text') 
                        return doRequest(path, param);
                    }
                };
            }
        ]);
});