define(function (require) {

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
        	var url = '/login/login.php';
        	$http.post(url, {
                username: $.trim($scope.userName),
                password: $scope.password
            }).success(function (res) {
                $location.url('/light-info');
            }).error(function (res) {
				debugger;
            });
        };

        $scope.clearErrorTip = function () {
            $scope.userNameTip = null;
        	$scope.errorTip = null;
        };

        
    };

    Controller.$inject = ['$scope', '$location', '$timeout', '$http'];

    return Controller;
});
