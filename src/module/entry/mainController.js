define(function (require) {
    function mainController($scope, $location, $interval, $window, $timeout, $rootScope) {
    	$scope.isLoginPage = function () {
    		if ($location.$$path == '/login') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isLoginPage = $scope.isLoginPage;

    	$scope.isProfilePage = function () {
    		if ($location.$$path == '/profile') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isProfilePage = $scope.isProfilePage;

    	$scope.isGeographyPage = function () {
    		if ($location.$$path == '/geography') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isGeographyPage = $scope.isGeographyPage;

    	$scope.isManipulationPage = function () {
    		if ($location.$$path == '/manipulation') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isManipulationPage = $scope.isManipulationPage;

    	$scope.isStatisticPage = function () {
    		if ($location.$$path == '/statistic') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isStatisticPage = $scope.isStatisticPage;

    	$scope.isFaultPage = function () {
    		if ($location.$$path == '/fault') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isFaultPage = $scope.isFaultPage;

    	$scope.isSetPage = function () {
    		if ($location.$$path == '/set') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	};
    	$rootScope.isSetPage = $scope.isSetPage;
    }


    mainController.$inject = ['$scope', '$location', '$interval', '$window', '$timeout', '$rootScope'];
    return mainController;
});