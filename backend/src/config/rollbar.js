const config = require("config");
var Rollbar = require('rollbar');

if (!config.get("rollbar.access_token")) {
    throw new Error("FATAL ERROR: ROLLBAR_ACCESS_TOKEN is not set in .env file");
}

const rollbar = new Rollbar({
    accessToken: config.get("rollbar.access_token"),
    captureUncaught: true,
    captureUnhandledRejections: true
  });

module.exports = rollbar;