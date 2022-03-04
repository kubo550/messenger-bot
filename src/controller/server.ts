import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import dotenv from "dotenv";
import WebhookController from './webhook/webhook-handler';
import HealthController from "./health-check/health-controller";
import ProfileController from "./profile/profile-handler";
import {verifyRequestSignature} from "../utils/verifyRequestSignature";


dotenv.config();

export const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json({
    limit: '2mb',
    verify: verifyRequestSignature
}));

app.use(express.static(path.join(path.resolve(), "public")));

app.set("view engine", "ejs");


const router = express.Router({mergeParams: true});



router.use('/health', HealthController);
router.use("/profile", ProfileController);
router.use('/webhook', WebhookController);

app.use('/', router);



if (process.env.stage !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
        const {appUrl, verifyToken, pageId} = process.env;

        if (appUrl && verifyToken && pageId) {
            console.log(`${appUrl}/profile?mode=all&verify_token=${verifyToken}`);
            console.log(`https://m.me/${pageId}`);
        }
    });
}

