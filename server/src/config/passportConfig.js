import passport_local from "passport-local";
import bcrypt from "bcrypt";
import { userModel } from "../model/userModel.js"
const LocalStrategy = passport_local.Strategy;

function initialize(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
    }, async (email, password, done) => {
        const user = await userModel.findOne({
            email: email
        })

        if (!user) {
            return done(null, false, {
                message: "No user with that email"
            })
        }

        try {
            const check = await bcrypt.compare(password, user.password);
            if (check) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Password incorrect" });
            }

        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, {
            id: user.id,
        })
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id.id);
        return done(null, user)
    })
}

export default initialize;
