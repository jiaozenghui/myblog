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

    }).controller('detailController', function ($scope, $http, $stateParams) {
        var id = $stateParams.id;
        $scope.article = {};
        $scope.newcomment = {};
        $scope.mapShowReply={};
        $scope.mapCommentReply={};
        var promise = $http({
            method:"get",
            url:"/article/" + id,
        }).then(function (result) {
            $scope.article = result.data.result;
/*             $("#article_detail").html($scope.article.content);  */              

        }).catch(function (result) {
            console.log(result)
        });


        $scope.getComments = function () {
            $http({
                method:"get",
                url:"/comment/list",
                params: {article: id}
            }).then(function (result) {
                $scope.comments = result.data.result;
            }).catch(function (result) {
                console.log(result)
            });
        }
        $scope.getComments();
        $scope.addComment = function (commentId, content) {
            var params = { 
                'comment': {
                    content: content,
                    article : id,
                    cid: commentId
                }
            }

            if (commentId) {
                params['comment']['replyTo'] = $scope.mapCommentReply[commentId].to;
            }
            
            var promise = $http({
                method:"post",
                url:"/user/comment",
                params: params
            }).then(function (result) {
                $scope.getComments();
                commentId&&$scope.cancelReply(commentId);
            }).catch(function (result) {
                console.log(result)
            });

        }

        $scope.replyComent = function(params, to) {
            $scope.mapCommentReply[params._id] = {
                showReplyContainer:true,
                to: to,
                content:""
            };
        }
        $scope.cancelReply = function(commentId) {
            this.mapCommentReply[commentId]= {};
        }


    }).controller('commentController', function ($scope, $http) {
        var locationUrl = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
        var id = locationUrl.substring(0, locationUrl.lastIndexOf("."));
        $scope.newcomment = {};
        $scope.mapShowReply={};
        $scope.mapCommentReply={};

        $scope.getComments = function () {
            $http({
                method:"get",
                url:"/comment/list",
                params: {article: id}
            }).then(function (result) {
                $scope.comments = result.data.result;
            }).catch(function (result) {
                console.log(result)
            });
        }
        $scope.getComments();
        $scope.addComment = function (commentId, content) {
            var params = { 
                'comment': {
                    content: content,
                    article : id,
                    cid: commentId
                }
            }

            if (commentId) {
                params['comment']['replyTo'] = $scope.mapCommentReply[commentId].to;
            }
            
            var promise = $http({
                method:"post",
                url:"/user/comment",
                params: params
            }).then(function (result) {
                $scope.getComments();
                commentId&&$scope.cancelReply(commentId);
            }).catch(function (result) {
                console.log(result)
            });

        }

        $scope.replyComent = function(params, to) {
            $scope.mapCommentReply[params._id] = {
                showReplyContainer:true,
                to: to,
                content:""
            };
        }
        $scope.cancelReply = function(commentId) {
            this.mapCommentReply[commentId]= {};
        }
    }).controller('editController', function ($scope, $http) {
        /* var ue = UE.getEditor('editor'); */
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
