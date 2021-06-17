(function (app) {
    'use strict';

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    angular.module('app', [
        'ueditor.directive'
    ]).controller('editController', function ($scope, $http) {
        /* var ue = UE.getEditor('editor'); */
        $scope.article = {
        };
        $scope.article_image =null;
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


        
        var id = GetQueryString("id");

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
                    $scope.article.category = $scope.categories[0];
                }
            } else {
                console.log('get categories fail!');
            }
            
        }).catch(function (result) {
            console.log(result)
        });




        $scope.btnTitle = "提交";
        $scope.addArticle = function () {
            let category = $scope.categories.filter(function(item){
                return item._id == $scope.article.category;
            })[0];
            var article ={
                   'title': $scope.article.title,
                    content: $scope.ueditorGetContent('editor'),
                    abstract: $scope.article.abstract,
                    category: $scope.article.category,
                    p_level: category.type,
                    p_level_name: category.name
                }
            if (id) {
                article.id = id;
            }
            var form = new FormData();
            form.append('article', article);
            form.append('article_image', $scope.article_image);
            var promise = $http({
                method:"post",
                url:"/admin/artice/new",
                processData: false,
                contentType: false,
                data: form
            }).then(function (result) {
                window.location = "/";
            }).catch(function (result) {
                console.log(result)
            });
        }
    });
})(angular.module('app'));
