export type ReceivedMessage = {
    object: 'page' | string,
    entry: {
        id: string,
        time: number,
        messaging: UserMessage[]
    }[]
}

type UserMessage = {
    sender: {
        id: string,
    },
    recipient: {
        id: string,
    },
    timestamp: number,

    message?: {
        mid: string,
        seq?: number,
        text: string,
        quick_reply?: {
            payload: string
        }
        attachments?: {
            type: string,
            payload: {
                url: string,
            },
        },
    },

    postback?: {
        payload: string,
        title: string,
        mid: string,
    },
}


export type Lesson = {
    date: string
    day: string
    from: string
    to: string
    subject: string
    type: string
    teacher?: string
    room?: string
}
