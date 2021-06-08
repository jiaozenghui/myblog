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
    }).catch(function (result) {
        console.log(result)
    });
    $rootScope.page = 1;
/*     $rootScope.getList = function(page){
        $http({
            method:"get",
            url:"/statistics",
            params: {pageIndex: page, pageSize: 10}
        }).then(function (result) {
            if (result.data.success == true) {
                $rootScope.recommend_articles = result.data.result;
                $rootScope.pv_total = result.data.pv_total;
                $rootScope.pc_total = result.data.pc_total;
                $rootScope.art_total = result.data.total;
            }
        

        }).catch(function (result) {
            console.log(result)
        });
    }
    $rootScope.getList(); */
}])
