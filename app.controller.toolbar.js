(function () {
    'use strict';

    function main($rootScope, $scope, $window) {
        var uri='data:application/vnd.ms-excel;base64,',
			template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
			base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
			format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        $scope.logout = function () {
            localStorage.removeItem('access_token');
            location.href = 'http://www.cosango.com/';
        };

        $scope.exportExcel = function (tableId) {
            var worksheetName = "Issues";
            var table=$(tableId),
					ctx={worksheet:worksheetName,table:table.html()},
                    href=uri+base64(format(template,ctx));
                    
            $window.setTimeout(function(){location.href=href;},100); // trigger download
        };

    $scope.showMe = true;

        $scope.toggleRightSidenav = function () {
            console.log('$rootScope.right_sidenav_locked_open', $rootScope.right_sidenav_locked_open);
            $rootScope.right_sidenav_locked_open = !$rootScope.right_sidenav_locked_open;
            $scope.showMe = !$scope.showMe;
        };

        $rootScope.right_sidenav_locked_open = true
    }

    angular.module('GitLabReportApp').controller('ToolbarController', ['$scope', '$rootScope', '$window',main]);

})();

