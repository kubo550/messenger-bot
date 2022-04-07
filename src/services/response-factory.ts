import {ScheduleResponder} from "./schedule-responser";
import {MessengerResponder} from "./message-responser";

enum ResponsePayload {
    SCHEDULE = "SCHEDULE",
}

export class ResponseFactory {
    constructor() {
    }

    public getResponder(payload: string) {
        // TODO: Default responder should ask for any help or something like that
        if (!payload) {
            return new MessengerResponder();
        } else if (payload.includes(ResponsePayload.SCHEDULE)) {
            return new ScheduleResponder(payload);
        } else {
            return new MessengerResponder()
        }
    }
}