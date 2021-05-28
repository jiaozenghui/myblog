(function (app) {
    'use strict';
    app.controller('articleController', function ($scope, $http) {
        $scope.page = 1;
        $scope.getList = function(page){
            $scope.page = page;
            $http({
                method:"get",
                url:"/articles",
            }).then(function (result) {
                if (result.data.success == true) {
                    $scope.articles = result.data.result;
                    $scope.total = result.data.total;
                }
            
    
            }).catch(function (result) {
                console.log(result)
            });
        }
        $scope.article_delete = function (article) {
            var promise = $http({
                method:"delete",
                url:"/article/delete/" + article._id
            }).then(function (result) {
                var index= $scope.articles.indexOf(article);
                $scope.articles.splice(index, 1);
            }).catch(function (result) {
                console.log(result)
            });

        }
        $scope.getList(1);
    }).controller('detailController', function ($scope, $http, $stateParams) {
        var id = $stateParams.id;
        $scope.article = {};
        var promise = $http({
            method:"get",
            url:"/article/" + id,
        }).then(function (result) {
            $scope.article = result.data.result;
            $("#article_detail").html($scope.article.content);               

        }).catch(function (result) {
            console.log(result)
        });

        var promise = $http({
            method:"get",
            url:"/comment/list",
            params: {article: id}
        }).then(function (result) {
            $scope.comments = result.data.result;
        }).catch(function (result) {
            console.log(result)
        });

        $scope.addComment = function (commentId) {
            var comment = { 
                'comment': {
                    content: $scope.newcomment.content,
                    article : id,
                    cid: commentId
                }
            }

            var promise = $http({
                method:"post",
                url:"/user/comment",
                params: comment
            }).then(function (result) {
                console.log(result); 
            }).catch(function (result) {
                console.log(result)
            });

        }

    }).controller('editController', function ($scope, $http, $stateParams, $rootScope) {
        /* var ue = UE.getEditor('editor'); */
        if (!$rootScope.user) {
            window.location = '/login';
        }
        $scope.article = {
        };
        $scope.categories = [];
        $scope.config={
                //初始化编辑器内容
                content : '',
                //是否聚焦 focus默认为false
                focus : true,
                //首行缩进距离,默认是2em
                indentValue:'2em',
                //初始化编辑器宽度,默认1000
                initialFrameWidth:'100%',
                //初始化编辑器高度,默认320
                initialFrameHeight:530,
                //编辑器初始化结束后,编辑区域是否是只读的，默认是false
                readonly : false ,
                //启用自动保存
                enableAutoSave: false,
                //自动保存间隔时间， 单位ms
                saveInterval: 500,
                //是否开启初始化时即全屏，默认关闭
                fullscreen : false,
                //图片操作的浮层开关，默认打开
                imagePopup:true,     
                //提交到后台的数据是否包含整个html字符串
                allHtmlEnabled:false,
                functions :['map','insertimage','insertvideo','attachment','insertcode','template', 'background', 'wordimage']     
        };
        var id = $stateParams.id;
        if (id) {
            var promise = $http({
                method:"get",
                url:"/article/" + id,
            }).then(function (result) {
                $scope.article = result.data.result;
                //$scope.ueditorSetContent('editor', $scope.article.content);
/*                 ue.addListener("ready", function () {  
                    ue.setContent($scope.article.content);
                });  */
                $scope.config.content = $scope.article.content;

            }).catch(function (result) {
                console.log(result)
            });
        }

        var promise = $http({
            method:"get",
            url:"/categories"
        }).then(function (result) {
            var result = result.data;
            if (result.success == true) {
                $scope.categories = result.result;
                if (!id) {
                    $scope.article.category = $scope.categories[0]._id;
                }
            } else {
                console.log('get categories fail!');
            }
            
        }).catch(function (result) {
            console.log(result)
        });




        $scope.btnTitle = "提交";
        $scope.addArticle = function () {
            var article = { 
                'article': {
                   'title': $scope.article.title,
                    content: $scope.ueditorGetContent('editor'),
                    abstract: $scope.article.abstract,
                    category: $scope.article.category
                }
            }
            if (id) {
                article.article.id = id;
            }

            var promise = $http({
                method:"post",
                url:"/admin/artice/new",
                params: article
            }).then(function (result) {
                console.log(result); 
            }).catch(function (result) {
                console.log(result)
            });
        }
    });
})(angular.module('app'));
