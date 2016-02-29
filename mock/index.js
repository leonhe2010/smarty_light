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
            // if (request.params.level == 1) {
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
            // } 
            // else if (request.level == 2) {
            //     reply({
            //         "status": 200,
            //         "data": {
            //             "msg": "success",
            //             "nodes": [
            //                 {"id": "2", "name": "上海"}
            //             ],
            //             "result": true
            //         },
            //         "error": null
            //     });  
            // }
            // else if (request.level == 3) {
            //     reply({
            //         "status": 200,
            //         "data": {
            //             "msg": "success",
            //             "nodes": [
            //                 {"id": "2", "name": "康桥智慧园区"}
            //             ],
            //             "result": true
            //         },
            //         "error": null
            //     });  
            // }
            // else {
            //     reply({
            //         "status": 200,
            //         "data": {
            //             "msg": "success",
            //             "nodes": [
            //                 {"id": "2", "name": "康桥智慧园区"}
            //             ],
            //             "result": true
            //         },
            //         "error": null
            //     });  
            // }
        }
    }


];