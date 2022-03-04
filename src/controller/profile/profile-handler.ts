import {Request, Response, Router} from "express";
import {Profile} from "../../utils/profile";


const router = Router({mergeParams: true});

router.get('/', async (req:Request, res:Response) => {
    const token = req.query["verify_token"];
    const mode = req.query["mode"];

    if (mode && token) {
        if (token === process.env.verifyToken) {
            res.write(`<h1>Welcome, your app is in ${mode} mode.</h1>`);
            const messengerBotProfile = new Profile(process.env.appUrl, process.env.shopUrl);

            try {
                await messengerBotProfile.setWebhook()
                await messengerBotProfile.getGetStarted();
                // await messengerBotProfile.setPersistentMenu();
                // await messengerBotProfile.setWhitelistedDomains();
                // await messengerBotProfile.setPageFeedWebhook();

                res.write(`<h1>Your Profile has been set </h1>`);
            } catch (err) {
                res.write(`<h1>Error</h1>`);
                res.write(`<p>${err}</p>`);
                console.log(err.message);

            }

            return res.status(200).end();

        } else {
            return res.sendStatus(403);
        }
    } else {
        return res.sendStatus(400);
    }
});

export default router;