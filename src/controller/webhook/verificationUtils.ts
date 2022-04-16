import {NextFunction, Request, Response} from "express";

export function isValidMode (mode: string) {
    return mode === "subscribe";
}

export function isValidToken (token: string) {
    return token === process.env.verifyToken;
}

export function getPayload(event: any) : string | undefined {
    return event.message?.quick_reply?.payload;
}

export function verifyModeAndToken(req:Request, res:Response, next:NextFunction) {
    if (req.query["hub.mode"] && req.query["hub.verify_token"]) {
        next();
    } else {
        res.status(401) .json({error: "No mode or token"});
    }
}