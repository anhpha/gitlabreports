(function() {
  "use strict";

  function main($rootScope, $scope, $mdSidenav, gitlab, auth) {
    $scope.$watch("project", function() {
      $scope.labels = null;
      $scope.milestone = null;
      $scope.state = null;
      //   $scope.page = 1;
      localStorage.removeItem("labels");
      localStorage.removeItem("milestone");
      localStorage.removeItem("state");
      localStorage.removeItem("assignee_id");
      localStorage.removeItem("issuse_from");
      localStorage.removeItem("issuse_to");

      if ($scope.project && $scope.project.id > 0) {
        $scope.loadProjectLabels();
        $scope.loadProjectMilestones();
      }

    });
    $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
        input.push(i);
      }
      return input;
    };

    $rootScope.$watch("show_comulative_time_estimate", function() {
      console.log($rootScope.show_comulative_time_estimate);
    });

    $scope.$watch("labels", function() {
      if ($scope.labels) {
      }
    });

    $scope.$watch("state", function() {
      if ($scope.state) {
      }
    });

    $scope.$watch("milestone", function() {
      if ($scope.milestone) {
      }
    });

    $scope.loadProjects = function() {
      $scope.projects = gitlab.projects.query(
        {
          access_token: auth.getAccessToken(),
          membership: true,
        },
        function(data, getHeaders) {
          $scope.projects.unshift({ name: "All", id: 0 });
          //   console.log($scope.projects);
        },
        function() {
          //   console.log($scope.projects);
        }
      );
    };

    $scope.loadUsers = function() {
      $scope.users = gitlab.users.query({
        access_token: auth.getAccessToken()
      });
    };

    $scope.loadProjectLabels = function() {
      if (!$scope.project) {
        return;
      }

      $scope.project_labels = gitlab.projects_labels.query({
        access_token: auth.getAccessToken(),
        id: $scope.project.id,
      });
    };

    $scope.loadProjectMilestones = function() {
      if (!$scope.project) {
        return;
      }

      $scope.project_milestones = gitlab.projects_milestones.query({
        access_token: auth.getAccessToken(),
        id: $scope.project.id,
      });
    };

    $scope.applyFilter = function() {
      if (!angular.isObject($scope.project)) {
        return;
      }

      localStorage.setItem("project_id", $scope.project.id);

      if ($scope.state) {
        localStorage.setItem("state", $scope.state);
      }
      if (angular.isObject($scope.milestone)) {
        localStorage.setItem("milestone", $scope.milestone.title);
      }
      if (angular.isObject($scope.labels)) {
        var l = [];
        angular.forEach($scope.labels, function(item) {
          l.push(item.name);
        });
        localStorage.setItem("labels", l.join(","));
      }

      if ($scope.user) {
        localStorage.setItem("assignee_id",$scope.user.id);
      }
      // Handler time
      var iss_from = $scope.from;
      var iss_to = $scope.to;

      
      iss_from.setHours(0,0,0,0);
      iss_to.setHours(22,59,59);
      console.log(iss_from.toISOString(), iss_to.toISOString());
      console.log(iss_from, iss_to);
      localStorage.setItem("issuse_from", iss_from.toISOString());
      localStorage.setItem("issuse_to", iss_to.toISOString());

      $rootScope.$broadcast("local-storage-updated");
    };

    $rootScope.show_comulative_time_estimate = true;
    $rootScope.show_comulative_time_spent = true;
    $rootScope.show_show_logo_print = true;
    $rootScope.table_columns = [
      "srno",
      "iid",
      "title",
      "created_at",
      "author",
      "assignee",
      "time_estimate",
      "total_time_spent",
    ];
    $scope.loadProjects();
    $scope.loadUsers();
    $scope.from = new Date();
    $scope.to = new Date();
  }

  angular.module("GitLabReportApp").controller("FilterController", main);
})();
