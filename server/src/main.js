import dotConfig from "./configs/configEnv.js";
import express from "express";
import app_route from "./routers/index.js"
import passport from "passport";
import initializePassport from "./configs/passportConfig.js"
import session from "express-session";
import handlebars from "express-handlebars"
import "./configs/connectDb.js";
import { fileURLToPath } from 'url';
import path from "path";

const PORT = dotConfig.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("view engine", "hbs");
app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    helpers: {
        eq: (val1, val2) => {
            return val1 === val2;
        }
    }
}))
app.set("views", path.join(__dirname, "views"))

initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: dotConfig.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

app_route(app)


app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
})
