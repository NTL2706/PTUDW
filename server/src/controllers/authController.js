import bcrypt from "bcrypt";
import { userModel, User } from "../models/userModel.js";
import { ErrorHandling } from "../error.js";
import dotConfig from "../configs/configEnv.js";

export async function register(req, res) {
    const { name, email, password } = req.body;
    console.log(req.body)
    const salt = bcrypt.genSaltSync(Number(dotConfig.SALTROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    try {
        const user = new userModel({
            name: name,
            email: email,
            password: hash,
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

