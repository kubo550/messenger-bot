export type RandomUserResponse = {
    results: RandomUser[]
    info: RandomUserInfo
}

export type RandomUser = {
    "gender": "female" | "male",
    "name": {
        "title": "Mrs" | "Ms",
        "first": string,
        "last": string,
    },
    "email": string,
    "phone": string,
    "cell": string,
}

type RandomUserInfo = {
    seed: string,
    results: number,
    page: number,
    version: string,
}