define(function (require) {

    'use strict';

    var config = {};

    config.calibrationOptions = [
        {
            value: 1,
            text: '天'
        },
        {
            value: 2,
            text: '周'
        },
        {
            value: 3,
            text: '月'
        },
        {
            value: 4,
            text: '年'
        }
    ];

    config.statisticTypeOptions = [
        {
            text: '电流',
            value: 1
        },
        {
            text: 'LED电压',
            value: 2
        },
        {
            text: 'LED电流',
            value: 3
        },
        {
            text: 'PWM1功率',
            value: 4
        },
        {
            text: 'PWM1剩余时间',
            value: 5
        },
        {
            text: '温度',
            value: 6
        },
        {
            text: '湿度',
            value: 7
        },
        {
            text: 'PM2.5',
            value: 8
        },
        {
            text: '噪声值',
            value: 9
        }
    ];

    return config;

});