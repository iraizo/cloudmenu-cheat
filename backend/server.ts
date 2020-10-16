import express from "express";
import next from "next";
import bodyParser from "body-parser";
import {AddressInfo} from "net";

const dev = process.env.NODE_ENV === "development";
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nextApp.prepare().then(async () => {
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    const s = app.listen(3002, () => {
        console.log(`Listening on port ${(s.address() as AddressInfo).port}`);
    });
});