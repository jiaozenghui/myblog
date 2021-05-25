'use strict';
var app = angular.module('app', [
    'ui.router',
    'ueditor.directive'
]).run(['$rootScope','$http',function($rootScope, $http){
    $http({
        method:"get",
        url:"/user/get",
    }).then(function (result) {
        if (result) {
            $rootScope.user = result.data.result;
        }
        if (result.data.success == false) {
            if (result.data.errCode == 401) {
                window.location = '/login';
            }
        }

    }).catch(function (result) {
        console.log(result)
    });
}])
