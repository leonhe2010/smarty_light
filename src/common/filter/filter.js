define(function (require) {

    'use strict';

    angular.module('app.filters', [])
        .filter('minuteTimeShow', function () {
            return function (num) {
                if ($.isNumeric(num)) {
                    var val = parseInt(num);

                    if (val > 24 * 60) {
                        return '--';
                    }

                    var result = '';
                    var hour = Math.floor(val / 60);
                    var minute = val % 60;
                    if (hour < 10) {
                        result += '0' + hour;
                    }
                    else {
                        result += hour;
                    }
                    result += ':';
                    if (minute < 10) {
                        result += '0' + minute;
                    }
                    else {
                        result += minute;
                    }

                    return result;
                }
                else {
                    return '--';
                }
            };
        })
        .filter('yesNOShow', function () {
            return function (value) {
                var val;
                if ($.isNumeric(value)) {
                    var key = parseInt(value);
                    switch (key) {
                        case 0:
                            val = '否';
                            break;
                        case 1:
                            val = '是';
                            break;
                        default:
                            val = '--';
                    }
                } else {
                    val = '--';
                }
                return val;
            };
        })
        .filter('levelShow', function () {
            return function (value) {
                var val;
                if ($.isNumeric(value)) {
                    var key = parseInt(value);
                    switch (key) {
                        case 4:
                            val = '分组';
                            break;
                        case 1:
                            val = '省';
                            break;
                        case 2:
                            val = '市';
                            break;
                        case 3:
                            val = '路灯集';
                            break;
                        default:
                            val = '--';
                    }
                }
                else {
                    val = '--';
                }
                return val;
            };
        })
        .filter('brokenTypeShow', function () {
            return function (value) {
                var val;
                if ($.isNumeric(value)) {
                    var key = parseInt(value);
                    switch (key) {
                        case 4:
                            val = '人群';
                            break;
                        case 1:
                            val = '路灯';
                            break;
                        case 2:
                            val = '环境';
                            break;
                        case 3:
                            val = '车辆';
                            break;
                        case 5:
                            val = '语音';
                            break;
                        default:
                            val = '--';
                    }
                }
                else {
                    val = '--';
                }
                return val;
            };
        });
});
