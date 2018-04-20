(function() {
  "use strict";

  function main() {
    return {
      getAccessToken: function() {
        return localStorage.getItem("access_token");
      },
      redirectToOauth: function() {
        var client_id = "";
        var redirect_uri = encodeURI("https://1123c1f4.ngrok.io/callback.html");
        var authorize_url =
          "https:///oauth/authorize?&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri +
          "&scope=api&response_type=token&state=1";
        location.href = authorize_url;
      },
    };
  }

  angular.module("GitLabReportApp").service("auth", main);
})();
