module.exports = function(){
    if (!process.env.JOB_TRACKER_JWT_PRIVATE_KEY){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}