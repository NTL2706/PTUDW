import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    dayOfBirth: Joi.string().required,
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    phone: Joi.string().required()
})

export { registerSchema }
