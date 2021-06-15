(function (app) {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }
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
                context.jump = jump;
    　　　　　　　init();
    　　　　　　　function init(){
    　　　　　　　　 context.pageNumber = Math.ceil(context.total/context.pageCount);
                    context.showPage= 5;
                    var page = GetQueryString("page");
                    context.pageIndex =  page? parseInt(page): 1;
                    context.maxPageIndex = Math.ceil(context.total/context.pageCount)< context.showPage? Math.ceil(context.total/context.pageCount): context.showPage;
                   
                    var ceillevel = Math.ceil(context.pageIndex/context.showPage);
                    var floorIndex = Math.ceil(context.pageIndex/context.showPage)-1;
                    var ceilIndex = ceillevel*context.showPage> Math.ceil(context.total/context.pageCount)? Math.ceil(context.total/context.pageCount):ceillevel*context.showPage;
                    var floorIndex = floorIndex*context.showPage+1;
                   initialPageList(floorIndex, ceilIndex);
                    
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
                    if (currentMaxPage < Math.ceil(context.total/context.pageCount) && page == currentMaxPage) {
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
                function jump(page) {
                    window.location = '/main?page='+ page;
                }
                function goToNext(page) {
                    if (page < context.total) {
                        context.pageIndex++;
                        jump(context.pageIndex);
                    }
                }
                function goToPre(page) {
                    if (page > 1) {
                        context.pageIndex--
                        jump(context.pageIndex);
                    }
                }
                function goToBegin() {
                    context.pageIndex =1;
                    jump(context.pageIndex);
                }
                function goToEnd() {
                    context.pageIndex =context.total;
                    jump(context.pageIndex);
                }
            }
        };
    }
    })(angular.module('app'));