import {Router} from "express";
import argon from "argon2";
import {v4} from "uuid";
import {db, createUser, getUser} from "../db";
const router = Router();

router.get("/currentUser", (req, res) => {
    res.json(req.session.user);
});

router.post("/register", async (req, res) => {
    if (!req.body.hasOwnProperty("username"))
        return res.status(400).json({ message: "No username provided" });

    const user = db.prepare("SELECT userid FROM users WHERE username=?").get(req.body.username);
    if(user) return res.status(409).json({
        success: false,
        error: "user already exists"
    });

    const token = await createUser(req.body.username);

    res.status(201).json({
        success: true,
        token
    });
});

router.post("/login", async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.status(400).json({
        success: false,
        error: "Token not provided"
    });
    getUser(token).then(user => {
        req.session.user = {
            ...user,
            auth: token
        };
        res.status(200).json({
            success: true,
        });
    }).catch(_e => {
        console.log(_e);
        res.status(400).json({
            success: false,
            error: "Invalid token"
        });
    });
});


export default router;