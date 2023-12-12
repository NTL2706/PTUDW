export async function homePage(req, res) {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        res.render("index");
    }
}