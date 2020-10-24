import express from "express";
import next from "next";
import bodyParser from "body-parser";
import {AddressInfo} from "net";
import auth from "./Routes/auth";
import menu from "./Routes/menu";
// @ts-ignore
import LevelSessionStore from "level-session-store";
import session from "express-session";
import path from "path";
import cors from 'cors';

const dev = process.env.NODE_ENV === "development";
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
const app = express();
const LevelStore = LevelSessionStore(session);

app.use(session({
    store: new LevelStore(path.join(__dirname, "./store", "./data", "./session")),
    secret: dev ? "oaksd90m109ckoasj0PDSAHhbco(nspmISJ(Dh1b8hwciusalnJ(*SCD^&Gdsaiudn891p" : String(process.env.SECRET),
    resave: false,
    saveUninitialized: false
}));

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/auth",auth);
app.use("/api/menu", menu);

nextApp.prepare().then(async () => {
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    const s = app.listen(3002, () => {
        console.log(`Listening on port ${(s.address() as AddressInfo).port}`);
    });
});

