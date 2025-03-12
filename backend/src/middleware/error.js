module.exports = function(error, req, res, next){
    // Log error.
    res.status(500).send('Something failed.');
}