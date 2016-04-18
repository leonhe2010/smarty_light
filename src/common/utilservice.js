define(function (require) {

    angular.module('app.services', []).factory('utilService', ['$modal', '$rootScope',
            function ($modal, $rootScope) {
        
        return {

            showMessage: function (content) {
                var newScope = $rootScope.$new();

                newScope.content = content;

                var dialog = $modal.open({
                    templateUrl: 'src/common/alert.html',
                    scope: newScope,
                    // resolve: {},
                    // backdrop: 'static'
                });

                newScope.closeAlertModal = function () {
                    dialog.dismiss();
                };

                return dialog.result;
            }      
        };
    }]);
});