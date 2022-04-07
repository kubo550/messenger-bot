import {IncomingMessage, ServerResponse} from "http";
import crypto from "crypto";

export function verifyRequestSignature(req: IncomingMessage, res: ServerResponse, buf: Buffer) {
    const signature = req.headers["x-hub-signature"] as string;

    if (!signature) {
        console.warn(`Couldn't find "x-hub-signature" in headers.`);
    } else {
        const elements = signature.split("=");
        const signatureHash = elements[1];
        const expectedHash = crypto
            .createHmac("sha1", process.env.appSecret)
            .update(buf)
            .digest("hex");
        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}
