import bcrypt from "bcrypt"
import { userModel, User } from "../model/userModel.js"
import { ErrorHandling } from "../error.js"
import dotConfig from "../config/configEnv.js"

export async function register(req, res) {
    const { name, dayofbirth, email, password, phone } = req.body;
    const salt = bcrypt.genSaltSync(Number(dotConfig.SALTROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    try {
        const user = new userModel({
            name: name,
            dayofbirth: dayofbirth,
            email: email,
            password: hash,
            phone: phone
        })

        await ErrorHandling(User, req.body);
        await user.save();
    } catch (error) {
        return res.status(400).json({
            err: error.message
        })
    }
    return res.status(200).json({
        message: "register success"
    })
}

