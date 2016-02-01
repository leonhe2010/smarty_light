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
        path: '/login/login.php',
        method: 'POST',
        handler: function (request, reply) {
            reply({
                "status": 200,
                "msg": "success",
                "result": true
            });
        }
    },


];