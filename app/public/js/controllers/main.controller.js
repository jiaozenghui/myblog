(function (app) {
    'use strict';
    app.controller('mainController', function ($scope, $http) {
    	//var ue = UE.getEditor('editor');
        $('#topnav a').click(function() {
            $(this).attr('id', 'topnav_current').siblings().removeAttr('id')
        });
    });
})(angular.module('app'));
