const webpush = require('web-push');

module.exports = function(){ 

if (!process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        throw new Error("FATAL ERROR: DATABASE_PASSWORD is not set in .env file");
    }

    webpush.setVapidDetails(
        'mailto:george@gmail.com', // Doesn't have to be real, but must be a valid email format
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
  }
