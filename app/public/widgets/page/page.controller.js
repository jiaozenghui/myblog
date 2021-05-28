(function (app) {
    app.directive('page', pageController);
    function pageController() {
        return {
            restrict: 'AE',
            templateUrl: 'widgets/page/page_template.html',
            scope: {
                pageCount:'=',
                total:"=",
                pageIndex: "=",
                onClickPage:'&'
            },
    
            link: function( scope, element ){
                var context = scope;
                context.goTo = goTo;
                context.goToNext = goToNext;
                context.goToPre = goToPre;
                context.goToBegin = goToBegin;
                context.goToEnd = goToEnd;

    　　　　　　　init();
    　　　　　　　function init(){
    　　　　　　　　context.pageNumber = 1;
                   context.showPage= 5;
                   context.maxPageIndex = Math.ceil(context.total%context.showPage)< context.showPage? Math.ceil(context.total%context.showPage): context.showPage;
                   initialPageList(1, context.maxPageIndex); 
    　　　　　　　}

                function initialPageList(beginIndex, endIndex) {
                    context.pageList=[];
                    for(let i = beginIndex; i <= endIndex; i++) {
                        context.pageList.push(i);
                    }
                    context.maxPageIndex = Math.max(...context.pageList);
                    context.minPageIndex = Math.min(...context.pageList);
                }

                function goTo(page) {
                    context.pageIndex = page;
                    context.onClickPage()(page);
                    let currentMaxPage = Math.max(...context.pageList, page);
                    let currentMinPage = Math.min(...context.pageList, page);
                    if (currentMaxPage < context.total && page == currentMaxPage) {
                        if ((page+ context.showPage) <= context.total) {
                            for(let i=page; i<=(page+context.showPage-1); i++) {
                                context.pageList.push(i);
                            }
                            initialPageList(page, page+context.showPage-1);
                        } else {
                            for(let i=(context.total-context.showPage+1); i<=context.total; i++) {
                                context.pageList.push(i);
                            }
                        }
                    } if (currentMinPage>1 &&  page == currentMinPage) {
                        context.pageList=[];
                        if (page > context.showPage) {
                            for(let i=(page-context.showPage+1); i<=page; i++) {
                                context.pageList.push(i);
                            }
                        } else {
                            for(let i=1; i<=context.showPage; i++) {
                                context.pageList.push(i);
                            }
                        }
                    }
                    context.maxPageIndex = Math.max(...context.pageList);
                    context.minPageIndex = Math.min(...context.pageList);
                    
                }
                function goToNext(page) {
                    if (page < context.total) {
                        context.pageIndex++;
                        goTo(context.pageIndex);
                    }
                }
                function goToPre(page) {
                    if (page > 1) {
                        context.pageIndex--
                        goTo(context.pageIndex);
                    }
                }
                function goToBegin() {
                    context.pageIndex =1;
                    context.pageList =[];
                    for(let i=1; i<=context.showPage; i++) {
                        context.pageList.push(i);
                    }
                    context.maxPageIndex = Math.max(...context.pageList);
                    context.minPageIndex = Math.min(...context.pageList);
                    context.onClickPage()(context.pageIndex);
                }
                function goToEnd() {
                    context.pageIndex =context.total;
                    context.pageList =[];
                    for(let i=(context.total-context.showPage+1); i<=context.total; i++) {
                        context.pageList.push(i);
                    }
                    context.maxPageIndex = Math.max(...context.pageList);
                    context.minPageIndex = Math.min(...context.pageList);
                    context.onClickPage()(page);
                }
            }
        };
    }
    })(angular.module('app'));