define(function (require) {    

    return [
        {
            path: '/login',
            tplUrl: 'src/module/login/tpl.html',
            controller: require('module/login/controller')
        },
        {
            path: '/profile',
            tplUrl: 'src/module/profile/tpl.html',
            controller: require('module/profile/controller')
        },
        {
            path: '/geography',
            tplUrl: 'src/module/geography/tpl.html',
            controller: require('module/geography/controller')
        },
        {
            path: '/manipulation',
            tplUrl: 'src/module/manipulation/tpl.html',
            controller: require('module/manipulation/controller')
        },
        {
            path: '/statistic',
            tplUrl: 'src/module/statistic/tpl.html',
            controller: require('module/statistic/controller')
        },
        {
            path: '/fault',
            tplUrl: 'src/module/fault/tpl.html',
            controller: require('module/fault/controller')
        },
        {
            path: '/set',
            tplUrl: 'src/module/set/tpl.html',
            controller: require('module/set/controller')
        }
    ];
});
