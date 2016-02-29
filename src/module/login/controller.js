define(function (require) {

    require('common/directive/leftTree/directive');

    function Controller($scope, $location, $timeout, $http) {

        $scope.login = function (argument) {
            if ($scope.userName == undefined) {
                $scope.userNameTip = '请输入用户名';
                return;
            }

            if ($scope.password == undefined) {
                $scope.loginTip = '请输入密码';
                return;
            }
            var url = '/smartcity/api/login';
            $http.post(url, {
                username: $.trim($scope.userName),
                password: $scope.password
            }).success(function (res) {
                if (res.data.result) {
                    $location.url('/profile');
                } else {
                    $scope.loginTip = res.error;
                }
            }).error(function (res) {
                alert('系统异常！');
            });
        };

        $scope.clearErrorTip = function () {
            $scope.userNameTip = null;
            $scope.loginTip = null;
        };

        
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http'];

    return Controller;
});
