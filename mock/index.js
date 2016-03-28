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
                        {"id": "23", "name": "上海"}, 
                        {"id": "15", "name": "北京"}
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
                    "level": 2,
                    "plans": [
                        {
                            start: 0, //开灯时间
                            end: 210, //关灯时间
                            brightness: 10, //亮度
                        },
                        {
                            start: 210, //开灯时间
                            end: 540, //关灯时间
                            brightness: 70, //亮度
                        },
                        {
                            start: 540, //开灯时间
                            end: 830, //关灯时间
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
        path: '/smartcity/api/add_light_group',
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
        path: '/smartcity/api/delete_light_group',
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
        path: '/smartcity/api/get_equipment_sampling',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "set": {
                        light: {frequency:250, level:1},
                        environment: {frequency:120, level:2},
                        vehicle: {frequency:60, level:3},
                        crowd: {frequency:550, level:4},
                        voice: {frequency:350, level:1},
                    }
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
    },

    {
        path: '/smartcity/api/get_light_group',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "set": [
                        {
                            lightLng: 23.12,
                            lightLat: 12.344,
                            lightId: 1,
                            lightName: "编号1灯"
                        },
                        {
                            lightId: 2,
                            lightLng: 213.12,
                            lightLat: 132.344,
                            lightName: "编号2灯"
                        },
                        {
                            lightId: 3,
                            lightLng: 2.12,
                            lightLat: 9.834,
                            lightName: "编号3灯"
                        }
                    ],
                    "result": true
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/change_province',
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
        path: '/smartcity/api/change_city',
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
        path: '/smartcity/api/change_set',
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
        path: '/smartcity/api/change_group',
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
        path: '/smartcity/api/get_lat_lng',
        method: 'POST',
        handler: function (request, reply) {
            var location = [];
            var i;
            for (i = 0; i < 20; i++) {
                location.push({
                    "lat": 40.04111723476737 + Math.ceil(Math.random() * 10) / 50 + '',
                    "lng": 116.3248028932062 + Math.ceil(Math.random() * 10) / 50 + '',
                    "isWorked": i % 3,
                    "lightId": i + 1,
                });
            }
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "location": location
                },
                "error": null
            });  
        }
    },
    
    {
        path: '/smartcity/api/get_statistic',
        method: 'POST',
        handler: function (request, reply) {
            var brokenInfo = [];
            var i;
            for (i = 0; i < 10; i++) {
                brokenInfo.push({
                    "value": Math.ceil(Math.random() * 200),
                    "time": '2016-02-1' + i,
                });
            }
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "brokenInfo": brokenInfo
                },
                "error": null
            });  
        }
    }
];