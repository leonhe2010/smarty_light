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
        .filter('onOffShow', function () {
            return function (value) {
                var val;
                if ($.isNumeric(value)) {
                    var key = parseInt(value);
                    if (key === 0) {
                        val = '关闭';
                    }
                    else {
                        val = '打开';
                    }
                } else {
                    val = '--';
                }
                return val;
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
        .filter('lightCtrlShow', function () {
            return function (value) {
                var val;
                if ($.isNumeric(value)) {
                    var key = parseInt(value);
                    switch (key) {
                        case 6:
                            val = '灯控';
                            break;
                        case 5:
                            val = '继电器5';
                            break;
                        case 4:
                            val = '继电器4';
                            break;
                        case 1:
                            val = '继电器1';
                            break;
                        case 2:
                            val = '继电器2';
                            break;
                        case 3:
                            val = '继电器3';
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
