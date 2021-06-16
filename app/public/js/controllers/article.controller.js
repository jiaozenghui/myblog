(function (app) {
    'use strict';

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    app.controller('articleController', function ($scope, $http) {
        $scope.page = 1;
/*         $scope.getList = function(page){
            $http({
                method:"get",
                url:"/articles",
                params: {pageIndex: page, pageSize: 10}
            }).then(function (result) {
                if (result.data.success == true) {
                    $scope.articles = result.data.result;
                    $scope.total = result.data.total;
                }
            
    
            }).catch(function (result) {
                console.log(result)
            });
        } */
        $scope.article_delete = function (article) {
            var promise = $http({
                method:"delete",
                url:"/article/delete/" + article
            }).then(function (result) {
                window.location = location.href;
            }).catch(function (result) {
                console.log(result)
            });

        }
        Date.prototype.Format = function (fmt) {
            var o = {
              'M+': this.getMonth() + 1,
              'd+': this.getDate(),
              'H+': this.getHours(),
              'm+': this.getMinutes(),
              's+': this.getSeconds(),
              'S+': this.getMilliseconds()
            };
            //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
            if (/(y+)/.test(fmt)) {
              //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
              fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
              if (new RegExp('(' + k + ')').test(fmt)) {
                //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
              }
            }
            return fmt;
          };
        /* var dateFormatter= function(value) { 
            var date = moment.parseZone(value).local().format('YYYY-MM-DD HH:mm:ss');
            return date;
        } */
        $scope.dateFormatter= function(time){
            var localTime = (new Date(time)) - (new Date().getTimezoneOffset())*60*1000;
            localTime = new Date(localTime).Format('yyyy-MM-dd HH:mm:ss');
            return localTime;
          }

    });
})(angular.module('app'));
