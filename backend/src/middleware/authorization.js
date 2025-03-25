const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded;
        next();
    }
    catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Access token expired.');
        } else {
            return res.status(403).send('Invalid token.');
        }
    }
}

const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).send('No refresh token provided.');

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).send('Invalid refresh token.');
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, authenticateRefreshToken };