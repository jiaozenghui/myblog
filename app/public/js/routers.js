(function (app) {
    'use strict';
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                url: '/',
                controller: 'articleController',
                templateUrl: '/pages/articles.html'
            })
            .state('main', {
                url: '/main',
                controller: 'articleController',
                templateUrl: '/pages/articles.html'
            })
            .state('aboutme', {
                url: '/aboutme',
                controller: 'aboutmeController',
                templateUrl: '/pages/about.html'
            })
            .state('life', {
                url: '/life',
                controller: 'articleController',
                templateUrl: '/pages/life.html'
            })
            .state('share', {
                url: '/share',
                controller: 'articleController',
                templateUrl: '/pages/share.html'
            })
            .state('new', {
                url: '/new',
                controller: 'articleController',
                templateUrl: '/pages/new.html'
            })
            .state('detail', {
                url: '/detail?id',
                controller: 'detailController',
                templateUrl: '/pages/detail.html'
            })
            .state('edit', {
                url: '/edit?id',
                controller: 'editController',
                templateUrl: '/pages/edit.html'
            })
    });
})(angular.module('app'));