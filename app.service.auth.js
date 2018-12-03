(function() {
  "use strict";

  function main() {
    return {
      getAccessToken: function() {
        return localStorage.getItem("access_token");
      },
      redirectToOauth: function() {
        var client_id =
          "c4d116b6c35d6d75e992a81211a50f5a1d6b0521f4f833e7009335fa53127b45";
        var redirect_uri = encodeURI("https://cec2b191.ngrok.io/callback.html");
        var authorize_url =
          "https://gitlab.jinn.vn/oauth/authorize?&client_id=" +
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
