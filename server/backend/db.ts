import sqlite from "better-sqlite3";
import { uuid } from "uuidv4";
import argon from "argon2";

export const db = sqlite("menu.db");

export interface User {
    userid: number,
    username: string,
    auth: string,
    features: JSON
};

const createStatement = db.prepare("INSERT INTO users (username, auth) VALUES (?, ?)");

export async function createUser(username: string) {
    const token = uuid();
    const hash = await argon.hash(token);
    console.log(createStatement.run(username, hash));
    return token;
}   

export async function deleteUser(auth: string): Promise<null> {
    return new Promise(async (resolve, reject) => {
        getUser(auth).then(user => {
            db.prepare("DELETE FROM users WHERE userid=?").run(user.userid);
            resolve();
        }).catch(reject);
    });
}

export async function getUser(auth: string): Promise<User> {    
    return new Promise(async (resolve, reject) => {
        const users = db.prepare("SELECT * FROM users").all();
        for (let user of users) {
            if(await argon.verify(user.auth, auth)) return resolve(user);
        }
        reject("User not found");
    });
}
