const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
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

    try {
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        req.user = user;
        next();  
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).send('Refresh token expired.');
        } else {
            return res.status(403).send('Invalid refresh token.');
        }
    }
};

module.exports = { authenticateToken, authenticateRefreshToken };