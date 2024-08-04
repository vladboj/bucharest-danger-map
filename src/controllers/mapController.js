function showMapPage(req, res) {
    const username = req.session.user.username;
    res.render("layouts/main", { title: "Bucharest Danger Map", page: "map", username: username });
}

module.exports = {
    showMapPage
};