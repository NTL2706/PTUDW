import ENV from "./config/configEnv.js";
import express from "express";
import app_route from "./routers/index.js"
import passport from "passport";
import initializePassport from "./config/passportConfig.js"
import session from "express-session";
import handlebars from "express-handlebars"
import "./config/connectDb.js";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set ("view engine", "hbs");
app.engine("hbs", handlebars.engine({
    extname:".hbs",
}))
app.set("views", path.join(__dirname, "views"))

initializePassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: ENV.SESSION_SECRET,
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize());
app.use(passport.session());

app_route(app)

app.listen(ENV.PORT || 3000, ()=>{
    console.log(`connected to port ${ENV.PORT}`)
})