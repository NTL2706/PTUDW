export async function homePage(req, res) {
    console.log(req.user)
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        res.render("index");
    }
}