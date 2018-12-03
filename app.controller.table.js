(function() {
  "use strict";

  function main($rootScope, $scope, gitlab, auth) {
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
      if (localStorage.getItem("milestone")) {
        params.milestone = localStorage.getItem("milestone");
      }
      if (localStorage.getItem("labels")) {
        params.labels = localStorage.getItem("labels");
      }
      if (params.id > 0) {
        $scope.issues = gitlab.projects_issues.query(
          params,
          function(issues, getHeaders) {
            $scope.pagingInfo = {
              page: getHeaders("x-page"),
              nextPage: getHeaders("x-next-page"),
              total: getHeaders("x-total"),
              totalPage: getHeaders("x-total-pages"),
              perPage: getHeaders("x-per-page"),
              prevPage: getHeaders("x-prev-page"),
            };
            // console.log($scope);
          },
          function() {
            auth.redirectToOauth();
          }
        );
      } else {
        $scope.issues = gitlab.issues.query(
          {
            per_page: 100,
            access_token: params.access_token,
            page: params.page,
            state: params.state,
          },
          function(issues, getHeaders) {
            $scope.pagingInfo = {
              page: getHeaders("x-page"),
              nextPage: getHeaders("x-next-page"),
              total: getHeaders("x-total"),
              totalPage: getHeaders("x-total-pages"),
              perPage: getHeaders("x-per-page"),
              prevPage: getHeaders("x-prev-page"),
            };
            //   console.log($scope);
          },
          function() {
            // auth.redirectToOauth();
          }
        );
      }
    };

    $scope.getIssuesTimeStats = function(issue_project_id, issue_iid) {
      var stats = gitlab.issues_time_stats.get(
        {
          access_token: localStorage.getItem("access_token"),
          id: issue_project_id,
          issue_iid: issue_iid,
        },
        function() {
          $scope.comulative_time_estimate += stats.time_estimate;
          $scope.comulative_time_spent += stats.total_time_spent;
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
