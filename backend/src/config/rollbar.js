var Rollbar = require('rollbar');

module.exports = function () {
  if (!process.env.ROLLBAR_ACCESS_TOKEN) {
    throw new Error("FATAL ERROR: ROLLBAR_ACCESS_TOKEN is not set in .env file");
  }

  return new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
  });
}