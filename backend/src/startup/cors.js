const cors = require("cors");

const allowedOrigins = [
  'http://localhost:5173',
  'https://lovely-puffpuff-4a6e3e.netlify.app'
];

module.exports = function (app) {
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
}
