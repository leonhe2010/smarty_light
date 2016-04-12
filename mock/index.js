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
        path: '/smartcity/api/get_light_detail',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "crowd": "0",//
                    "current": 12,//
                    "environment": "1",//
                    "humidity": 0,//
                    "lat": "40.2411",//
                    "light": "1",//
                    "lightNum": "11",//
                    "lng": "116.485",//
                    "msg": "success",//
                    "pm2p5": 0,//
                    "power": 0,//
                    "result": true,//
                    "temperature": 0,//
                    "vehicle": "0",//
                    "voice": null,//
                    "voltage": 0//
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
        path: '/smartcity/api/get_light_video',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "lightNum": "11",
                    "videoSrc": "http://123.125.86.20/vlive.qqvideo.tc.qq.com/i0015iurhdl.mp4?sdtfrom=v1010&vkey=9775221235B5925ABC0236071D9A8A751E0EB074A2BDF2D882D42CF29D3BF357790BDACF4D76F40F12655A66F692FC50B2548B501AFE7D5911876BEFC3AC3D90FAF9F45AE7744ABF07E06B7E43780E18062C010FC68EF366"
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_light_history_video',
        method: 'POST',
        handler: function (request, reply) {
            var videoInfo = [];
            var i;
            for (i = 0; i < 10; i++) {
                videoInfo.push({
                    "videoTime": "2016-03-27 13:00:00",
                    "videoSrc": "http://123.125.86.20/vlive.qqvideo.tc.qq.com/i0015iurhdl.mp4?sdtfrom=v1010&vkey=9775221235B5925ABC0236071D9A8A751E0EB074A2BDF2D882D42CF29D3BF357790BDACF4D76F40F12655A66F692FC50B2548B501AFE7D5911876BEFC3AC3D90FAF9F45AE7744ABF07E06B7E43780E18062C010FC68EF366"
                })
            }
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "pageDto": {
                        "totalCount": 101
                    },
                    "lightNum": "11",
                    "videoInfo": videoInfo
                    
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
                    "isWorked": i % 2 + 1,
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
            for (i = 0; i < 30; i++) {
                brokenInfo.push(Math.ceil(Math.random() * 200));
            }
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "info": brokenInfo
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_sampling_frequency',
        method: 'POST',
        handler: function (request, reply) {
            
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "set": {
                        "environment": {
                            "frequency": "70", 
                            "level": "4"
                        }
                    }
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_broken_table',
        method: 'POST',
        handler: function (request, reply) {
            var brokenInfo = [];
            var i;
            for (i = 0; i < 10; i++) {
                brokenInfo.push({
                    "time": "2016-03-27 15:45:0" + i,
                    "name": "10" + i,
                    "type": 2
                });
            }
            reply({
                "status": 200,
                "data": {
                    "msg": "success",
                    "result": true,
                    "brokenInfo": brokenInfo,
                    "pageDto": {
                        "totalCount": 78
                    }
                },
                "error": null
            });  
        }
    },

    {
        path: '/smartcity/api/get_broken_chart',
        method: 'POST',
        handler: function (request, reply) {
            var i;
            var light = [];
            var environment = [];
            var vehicle = [];
            var crowd = [];
            var voice = [];

            for (i = 0; i < 10; i++) {
                light.push(Math.ceil(Math.random() * 200));
                environment.push(Math.ceil(Math.random() * 200));
                vehicle.push(Math.ceil(Math.random() * 200));
                crowd.push(Math.ceil(Math.random() * 200));
                voice.push(Math.ceil(Math.random() * 200));
            };

            var brokenInfo = {
                "light": light,
                "environment": environment,
                "vehicle": vehicle,
                "crowd": crowd,
                "voice": voice
            };
            
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