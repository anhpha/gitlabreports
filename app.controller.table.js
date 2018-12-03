(function() {
  "use strict";

  

  function main($rootScope, $scope, gitlab, auth) {
    
    $scope.pagingInfo = {
      page: 1,
      nextPage: 1,
      total: 1,
      totalPage: 1,
      perPage: 1,
      prevPage: 1,
    };
    $scope.issues = [];
    
    function fetchAllIssues(params, errorCallback){
      var fetcher = gitlab.projects_issues;
      if (params.id <= 0) {
        params.per_page = 100;
        fetcher = gitlab.issues;
      }
      $scope.fetchingParams = params; 
      fetcher.query(
        params,
        getPagingInfo,
        errorCallback
      )
      // var count = 0;
      // while(+$scope.pagingInfo.page < + $scope.pagingInfo.totalPage && count <= 10){
      //   console.log("Running");
      //   params.page = +$scope.pagingInfo.page + 1;
      //   console.log(params);
      //   $scope.issues.push(fetcher.query(
      //     params,
      //     getPagingInfo,
      //     errorCallback
      //   ));
      //   count++;
      // }
    }
  
    function getPagingInfo(issues, getHeaders) {
      // console.log("Running get paging infor.", issues);
      $scope.pagingInfo = {
        page: getHeaders("x-page"),
        nextPage: getHeaders("x-next-page"),
        total: getHeaders("x-total"),
        totalPage: getHeaders("x-total-pages"),
        perPage: getHeaders("x-per-page"),
        prevPage: getHeaders("x-prev-page"),
      };
      $scope.issues = $scope.issues.concat(issues);
      // issues.$promise.then(function(iss){
      //   $scope.issues.push(issues);
      //   // console.log(issues[0]);
      // });
      // console.log("Global", $scope.pagingInfo);
      if (+$scope.pagingInfo.page < + $scope.pagingInfo.totalPage) {
        var paramas = $scope.fetchingParams;
        paramas.page = +$scope.pagingInfo.page + 1;
        fetchAllIssues(paramas);
      }
    }
    
    
    
    
    $rootScope.$on("local-storage-updated", function() {
      $scope.comulative_time_spent = 0;
      $scope.page = 1;
      $scope.comulative_time_estimate = 0;
      $scope.loadIssues();
    });

    $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
        input.push(i);
      }
      return input;
    };

    $scope.$watch("page", function() {
      if ($scope.page) {
        // console.log("page", $scope.page);
        localStorage.setItem("page", $scope.page);
      }
      $scope.loadIssues();
    });

    $scope.loadIssues = function() {
      var params = {};
      if (localStorage.getItem("access_token")) {
        params.access_token = localStorage.getItem("access_token");
      } else {
        return;
      }
      if (localStorage.getItem("page")) {
        params.page = localStorage.getItem("page");
      } else {
        params.page = 1;
      }
      if (localStorage.getItem("project_id")) {
        params.id = localStorage.getItem("project_id");
      } else {
        return;
      }
      if (localStorage.getItem("state")) {
        params.state = localStorage.getItem("state");
      }
      // if (localStorage.getItem("milestone")) {
      //   params.milestone = localStorage.getItem("milestone");
      // }
      // if (localStorage.getItem("labels")) {
      //   params.labels = localStorage.getItem("labels");
      // }

      if (localStorage.getItem("assignee_id")) {
        params.assignee_id = localStorage.getItem("assignee_id");
      }
      if (localStorage.getItem("issuse_from")) {
        params.updated_after = localStorage.getItem("issuse_from");
      }
      if (localStorage.getItem("issuse_to")) {
        params.updated_before = localStorage.getItem("issuse_to");
      }

      params.order_by = 'updated_at';
      $scope.issues = [];

      fetchAllIssues(params,
               function() {
                auth.redirectToOauth();
              }
            );

    //   if (params.id > 0) {
    //     $scope.issues = gitlab.projects_issues.query(
    //       params,
    //       function(issues, getHeaders) {
    //         $scope.pagingInfo = {
    //           page: getHeaders("x-page"),
    //           nextPage: getHeaders("x-next-page"),
    //           total: getHeaders("x-total"),
    //           totalPage: getHeaders("x-total-pages"),
    //           perPage: getHeaders("x-per-page"),
    //           prevPage: getHeaders("x-prev-page"),
    //         };
    //         // console.log($scope);
    //       },
    //       function() {
    //         auth.redirectToOauth();
    //       }
    //     );
    //   } else {
    //     $scope.issues = gitlab.issues.query(
    //       {
    //         per_page: 100,
    //         access_token: params.access_token,
    //         page: params.page,
    //         state: params.state,
    //         assignee_id: params.assignee_id,
    //         updated_after: params.updated_after,
    //         updated_before: params.updated_before,
    //         order_by: params.order_by
    //       },
    //       function(issues, getHeaders) {
    //         $scope.pagingInfo = {
    //           page: getHeaders("x-page"),
    //           nextPage: getHeaders("x-next-page"),
    //           total: getHeaders("x-total"),
    //           totalPage: getHeaders("x-total-pages"),
    //           perPage: getHeaders("x-per-page"),
    //           prevPage: getHeaders("x-prev-page"),
    //         };
    //         //   console.log($scope);
    //       },
    //       function() {
    //         // auth.redirectToOauth();
    //       }
    //     );
    //   }
    };

    $scope.getIssuesTimeStats = function(issue_project_id, issue_iid) {
      var stats = gitlab.issues_time_stats.get(
        {
          access_token: localStorage.getItem("access_token"),
          id: issue_project_id,
          issue_iid: issue_iid,
        },
        function() {
          if (stats.time_estimate > 0 && stats.total_time_spent > 0) {
            $scope.comulative_time_estimate += stats.time_estimate;
            $scope.comulative_time_spent += stats.total_time_spent;
          }
          
          //   console.log(
          //     $scope.comulative_time_estimate,
          //     $scope.comulative_time_spent
          //   );
        }
      );

      return stats;
    };
  }

  angular.module("GitLabReportApp").controller("TableController", main);
})();
