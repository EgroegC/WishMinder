module.exports = function(){
    if (!process.env.JWT_ACCESS_TOKEN || !process.env.JWT_REFRESH_TOKEN){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}