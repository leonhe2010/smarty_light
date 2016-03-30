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
    
    config.brokenTypeOptions = [
        {
            title: 'light',
            text: '路灯',
            value: 1
        },
        {
            title: 'environment',
            text: '环境',
            value: 2
        },
        {
            title: 'vehicle',
            text: '车辆',
            value: 3
        },
        {
            title: 'crowd',
            text: '人群',
            value: 4
        },
        {
            title: 'voice',
            text: '语音',
            value: 5
        },
        {
            title: 'all',
            text: '所有',
            value: 6
        }
    ];

    return config;

});