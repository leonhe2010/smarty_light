exports.mocks = [

    {
        path: '/index.do',
        method: 'GET',
        handler: function (request, reply) {
            reply({
                "code": 0,
                "msg": "success",
                "data": {
                    "message": "hello world"
                }
            });
        }
    },
    
    {
        path: '/smartcity/api/login',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                }
            });
        }
    },

    {
        path: '/smartcity/api/get_basic_info',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "current": 12,
                    "device": {
                        "camera": {total: 100, work: 10, fault: 30},
                        "controller": {total: 1, work: 1, fault: 0},
                        "light": {total: 12, work: 2, fault: 0},
                        "sensor": {total: 14, work: 1, fault: 0},
                        "wifi": {total: 1, work: 1, fault: 0}
                    },
                    "humidity": 60,
                    "msg": "success",
                    "pm2p5": 100,
                    "power": 100,
                    "result": true,
                    "temperature": 20,
                    "voltage": 220
                    // 'particle': 223,
                },
                "error": null
            });
        }
    },

    {
        path: '/smartcity/api/get_child_node',
        method: 'POST',
        handler: function (request, reply) {
            console.log('sdsdssdsdssd: '); 
            console.log('sdsdssdsdssd: ', JSON.stringify(request.params)); 
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "nodes": [
                        {"id": "2", "name": "上海"}, 
                        {"id": "1", "name": "北京"}
                    ],
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/set_light_auto',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/set_light_manual',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/set_light_plan',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_light_plan',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "set": [
                        {
                            planId: 1,
                            startHour: 11, //开灯时间
                            startMinute: 30, //开灯时间
                            endHour: 21, //关灯时间
                            endMinute: 20, //关灯时间
                            brightness: 10, //亮度
                        },
                        {
                            planId: 2,
                            startHour: 13, //开灯时间
                            startMinute: 30, //开灯时间
                            endHour: 23, //关灯时间
                            endMinute: 40, //关灯时间
                            brightness: 70, //亮度
                        }
                    ],
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/delete_light_plan',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/add_light_ungrouped',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_ungrouped_light',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "light": [
                        {
                            lightId: 1,
                            lightName: "编号1灯"
                        },
                        {
                            lightId: 2,
                            lightName: "编号2灯"
                        },
                        {
                            lightId: 3,
                            lightName: "编号3灯"
                        },
                    ],
                    "result": true
                },
                "error": null
            });  
        }
    }
];