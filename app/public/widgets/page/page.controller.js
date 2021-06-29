(function (app) {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    function changeURLArg(url,arg,arg_val){
        var pattern=arg+'=([^&]*)';
        var replaceText=arg+'='+arg_val; 
        if(url.match(pattern)){
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        }else{ 
            if(url.match('[\?]')){ 
                return url+'&'+replaceText; 
            }else{ 
                return url+'?'+replaceText; 
            } 
        }
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
                    context.mappage={};
                    for(let i = beginIndex; i <= endIndex; i++) {
                        context.pageList.push(i);
                        context.mappage[i.toString()]= changeURLArg(window.location.href, 'page', i);
                    }
                    context.mappage[context.pageNumber]= changeURLArg(window.location.href, 'page', context.pageNumber);
                    context.maxPageIndex = Math.max(...context.pageList);
                    context.minPageIndex = Math.min(...context.pageList);
                }

            }
        };
    }
    })(angular.module('app'));