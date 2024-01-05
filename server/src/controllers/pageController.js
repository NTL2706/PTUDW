export async function loginPage(req, res) {
    if (
        !req.user
    ) {
        res.render("html/index");
    }
    else {
        res.redirect('/');;
    }
}

export async function homePage(req, res) {
    if (!req.user) {
        res.redirect("/login");
    } else {
        res.render("html/index");
    }
}