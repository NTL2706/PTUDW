import authRoute from "./auth/authRoute.js";
import pageRoute from "./pageRoute.js";
import adsRoute from "./ads/index.js";

function app_route(app) {
    app.use("/", pageRoute);
    app.use("/auth", authRoute);
    app.use("/ads", adsRoute);
}

export default app_route;