import {json, Router} from "express";
import { getUser, db } from "../db";

const router = Router();

const gStatement = db.prepare("SELECT features FROM users WHERE userid=?")

/* im not sure why i did /getInfo its completly useless, its 3 am */ 

router.get("/getInfo", async(req, res) => {
    const auth = req.headers.authorization;

    if(auth) {
        getUser(auth).then(user => {

            res.status(200).json({
                success: true,
                data: gStatement.get(user.userid)
            })

        }).catch(_e  => {
            
            console.log(_e);
            
            res.status(403).json({
                success: false,
                error: "Authorization header is incorrect.",
            }); 
        });   
    } else {
        res.status(403).json({
            success: false,
            error: "Authorization header is not existing.",
        });
    }
});

const iStatement = db.prepare("UPDATE users SET features=? WHERE userid=?");

function IsJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.post("/sendInfo", async(req, res) => {
    const auth = req.headers.authorization;
    const data = JSON.stringify(req.body.data);

    if(!data) {
        res.status(403).json({
            success: false,
            error: "No data given."
        }) 
    }


    if(!IsJsonString(data)) {
        res.status(403).json({
            success: false,
            error: "Data is not in the correct JSON format."
        })
    }

    if(auth) {
        getUser(auth).then(user => {
            iStatement.run(data, user.userid);

            res.status(200).json({
                success: true,
                message: "Sucessfully sent data."
            })
            
        }).catch(_e  => {
            console.log(_e);
            res.status(403).json({
                success: false,
                error: "Authorization header is incorrect.",
            }); 
        });   
    } else {
        res.status(403).json({
            success: false,
            error: "Authorization header is not existing.",
        });
    }
});


export default router;