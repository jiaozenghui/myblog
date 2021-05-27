(function (app) {//自定义指令
    app.directive('page', pageController);
    function pageController() {
        return {
            restrict: 'AE',
            templateUrl: 'widgets/page/page_template.html',
            scope: {
                pageCount:'=',//对应totalPage
                total:"=",
                pageIndex: "=",
                onClickPage:'&' //对应reloadData()
            },
    
            link: function( scope ){
                var context = scope;
                context.onClickPrev = onClickPrev;
                context.onClickNext = onClickNext;
                context.onClickPageNumber = onClickPageNumber;
                context.goTo = goTo;
                context.goToNext = goToNext;
    　　　　　　　
    　　　　　　　//$scope.watch为了兼容以前版本写法(如一开始就用这个分页组件,分页逻辑相同，可修改为下面一种写法)
/*                 !function init() { //！function init()效果和下面一样(这里做了老版本兼容)
                    context.pageNumber = 1;
                    scope.$watch(function () {
                        return context.pageCount//监听发现分页总数变了，执行后面函数
                    }, function () {
                        if (typeof context.pageCount != 'object' && typeof parseInt(context.pageCount) == 'number') {
                            var temp = [];
                            for (var i = 1; i <= context.pageCount; i++) {
                                temp.push(i);
                            }
                            context.pageCount = temp;
                        }
                    });
                }(); */
                !function init() { //！function init()效果和下面一样(这里做了老版本兼容)
                    context.pageIndex = 1;
                    scope.$watch(function () {
                        return context.total//监听发现分页总数变了，执行后面函数
                    }, function () {
                        context.pageIndex = 1;
                        context.showPage= 5;
                        context.pageList=[];
                        context.maxPageIndex = context.total< context.showPage? context.total: context.showPage;
                        for(let i=1; i<=context.maxPageIndex; i++) {
                            context.pageList.push(i);
                        }
                    });
                }();

    　　　　　　　//分页逻辑相同，可直接将init写为这样(不用兼容以前)
    　　　　　　　init();
/*     　　　　　　　function init(){
    　　　　　　　　context.pageNumber = 1;
                   context.showPage= 5;
                   context.pageList=[];
                   context.maxPageIndex = total< context.showPage? total: context.showPage;
                   for(let i=1; i<=context.maxPageIndex; i++) {
                       context.pageList.push(i);
                   }
    　　　　　　　} */
    　
                function onClickPageNumber(pageNumber) {
                    context.onClickPage({page:pageNumber});//这里必须按着这种格式写，他是根据数组中的参数名对应来找
    　　　　　　　　　　//如果直接这样传参context.onClickPage(pageNumber),会报Cannot use 'in' operator to search for 'reloadData' in 2（寻找不到参数错误）
                    context.pageNumber = pageNumber;
                    context.showPrev = pageNumber > 1;
                }
    
                function onClickPrev() {
                    context.pageNumber -= 1;
                    context.onClickPage({message:context.pageNumber});
                    if (context.pageNumber == 1) {
                        context.showPrev = false;
                    }
                    context.showNext = true;
                }
    
                function onClickNext() {
    
                    if (context.pageNumber < context.pageCount.length) {
                        context.pageNumber += 1;
                    }
                    context.onClickPage({message:context.pageNumber});
                }

                function goTo(page) {
                    context.pageIndex = page;
                    let currentMaxPage = Math.max(pageList);
                    if (currentMaxPage < context.total && page == currentMaxPage) {
                        context.pageList=[];
                        if ((page+ context.showPage) <= context.total) {
                            for(let i=page; i<=(page+context.showPage); i++) {
                                context.pageList.push(i);
                            }
                        } else {
                            for(let i=(context.total-context.showPage); i<=context.total; i++) {
                                context.pageList.push(i);
                            }
                        }
                    }
                    context.maxPageIndex = Math.max(context.pageList);
                }
                function goToNext(page) {
                    if (page < context.total) {
                        context.pageIndex++;
                        goTo(context.pageIndex);
                    }
                }
            }
        };
    }
    })(angular.module('app'));