import authRoute from "./auth/authRoute.js"
import pageRoute from "./pageRoute.js"
function app_route(app) {
    app.use("/", pageRoute)
    app.use("/auth", authRoute);
}

export default app_route;