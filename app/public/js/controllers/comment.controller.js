(function (app) {
    'use strict';
    app.controller('commentController', function ($scope, $http) {
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
    });
})(angular.module('app'));
