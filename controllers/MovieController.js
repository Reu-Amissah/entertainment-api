module.exports = {
    get: (req, res, next) => {
        res.send("The app is live");
        next()
    }
}