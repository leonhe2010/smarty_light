define(function (require) {    

    return [
        {
            path: '/login',
            tplUrl: 'src/module/login/tpl.html',
            controller: require('module/login/controller')
        },
        {
            path: '/light-info',
            tplUrl: 'src/module/lightInfo/tpl.html',
            controller: require('module/lightInfo/controller')
        }
    ];
});
