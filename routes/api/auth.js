const express = require("express");
const router = express.Router();
const {schemas} = require("../../models/user");
const HttpError = require("../../helpers/HttpError");
const {User} = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = process.env;


router.post("/register", async(req,res,next) => {
try {
    const { error } = schemas.registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription
        }
      } 
    )
} catch (error) {
    next(error);
}
})

router.post("/login", async(req,res,next) => {
    try {
        const { error } = schemas.loginSchema.validate(req.body);
        if (error) {
          throw HttpError(400, error.message);
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw HttpError(401, "Email or password invalid")
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            throw HttpError(401, "Email or password invalid")
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"})

        res.json({
            token,
        })

    } catch (error) {
        next(error);
    }
    })

module.exports = router;