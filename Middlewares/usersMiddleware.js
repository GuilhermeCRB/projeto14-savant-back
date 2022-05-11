import joi from "joi";
import { stripHtml } from "string-strip-html";

export async function validateSignUp(req, res, next){
    const user = req.body;

    const userSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&\-\.\,]{8,}$'))
    });

    const validation = userSchema.validate(user);
    if (validation.error) return res.status(422).send(validation.error);

    const sanitizedUser = {
        ...user,
        firstName: stripHtml(user.firstName).result,
        lastName: stripHtml(user.lastName).result,
        email: stripHtml(user.email).result,
        password: stripHtml(user.password).result
    }

    res.locals.user = sanitizedUser;

    next();
}