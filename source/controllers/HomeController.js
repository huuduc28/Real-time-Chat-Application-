class HomeController {
    //Comment path and method to use this function
    // GET: /
    async renderHome (req, res) {
        if (!req.session.user && !req.user) {
            return res.redirect('/account/login')
        }
        const user = req.session.user || req.user
        //console.log(user)
        res.render('home',{user})
    }
}

module.exports = new HomeController();