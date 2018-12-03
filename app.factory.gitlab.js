(function() {
  "use strict";

  function main($resource) {
    return {
      issues: $resource(
        "https://gitlab.jinn.vn/api/v4/issues?per_page=:per_page",
        { per_page: 100 },
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
      users: $resource(
        "https://gitlab.jinn.vn/api/v4/users?per_page=:per_page",
        { per_page: 100 },
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
      issues_time_stats: $resource(
        "https://gitlab.jinn.vn/api/v4/projects/:id/issues/:issue_iid/time_stats",
        {},
        {
          get: {
            method: "GET",
          },
        }
      ),
      projects: $resource(
        "https://gitlab.jinn.vn/api/v4/projects?per_page=100",
        {},
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
      projects_issues: $resource(
        "https://gitlab.jinn.vn/api/v4/projects/:id/issues?per_page=:per_page",
        {
          per_page: 20,
        },
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
      projects_labels: $resource(
        "https://gitlab.jinn.vn/api/v4/projects/:id/labels",
        {},
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
      projects_milestones: $resource(
        "https://gitlab.jinn.vn/api/v4/projects/:id/milestones",
        {},
        {
          query: {
            method: "GET",
            isArray: true,
          },
        }
      ),
    };
  }

  angular.module("GitLabReportApp").factory("gitlab", main);
})();
