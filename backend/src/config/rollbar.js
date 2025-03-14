const config = require("config");
var Rollbar = require('rollbar');

module.exports = function(){
  if (!config.get("rollbar.access_token")) {
    throw new Error("FATAL ERROR: ROLLBAR_ACCESS_TOKEN is not set in .env file");
}

 return new Rollbar({
    accessToken: config.get("rollbar.access_token"),
    captureUncaught: true,
    captureUnhandledRejections: true
  });
}