import authRoute from "./auth/authRoute.js";
import pageRoute from "./pageRoute.js";
import adsRoute from "./ads/index.js";
import placeRoute from "./place/index.js";
import cbRoute from "./cbRoute.js";
import apiRoute from "./api/index.js";
import reportRoute from "./report/index.js";
import changeRoute from "./change/index.js";
import licensingRoute from "./licensingRoute.js";

function app_route(app) {
    app.use("/", pageRoute);
    app.use("/auth", authRoute);
    app.use("/ads", adsRoute);
    app.use("/cb", cbRoute);
    app.use("/place", placeRoute);
    app.use("/report", reportRoute);
    app.use("/change", changeRoute);
    app.use("/licensing", licensingRoute);

    app.use("/api", apiRoute);
}

export default app_route;