import axios from 'axios';
import fetch from 'cross-fetch';
import {URL, URLSearchParams} from "url";



class GraphApi {
    static async callSendApi(requestBody:any) {
        let url = new URL(`${process.env.apiUrl}/me/messages`);
        //@ts-ignore
        url.search = new URLSearchParams({
            access_token: process.env.pageAccesToken
        });
        return axios(url.toString().toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: requestBody
        });

    }

    static async callMessengerProfileAPI(requestBody: any) :Promise<any> {
        console.log(`Setting Messenger Profile for app ${process.env.appId}`);
        const url = new URL(`${process.env.appUrl}/me/messenger_profile`);


        url.search = new URLSearchParams({
            access_token: process.env.pageAccesToken
        }).toString();

        return  axios(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: requestBody
        });

    }

    static async callSubscriptionsAPI(customFields?: string): Promise<any>  {
        const webhookUrl = `${process.env.appUrl}/webhook`;
        console.log(`Setting app ${process.env.appId} callback url to ${webhookUrl}`);

        const fields = `messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals${customFields ? ", " + customFields : ""}`;

        const url = new URL(`${process.env.apiUrl}/${process.env.appId}/subscriptions`);

        url.search = new URLSearchParams({
            access_token: process.env.pageAccesToken,
            object: "page",
            callback_url: webhookUrl,
            verify_token: process.env.verifyToken,
            fields: fields,
            include_values: "true"
        }).toString();

         return fetch(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
    }

    static async callSubscribedApps(customFields?:any | undefined) {

        console.log(`Subscribing app ${process.env.appId} to page ${process.env.pageId}`);

        let fields =
            "messages, messaging_postbacks, messaging_optins, " +
            "message_deliveries, messaging_referrals";

        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }

        let url = new URL(`${process.env.apiUrl}/${process.env.pageId}/subscribed_apps`);
        //@ts-ignore
        url.search = new URLSearchParams({
            access_token: process.env.pageAccesToken,
            subscribed_fields: fields
        });

        console.log(url.toString());

        return axios(url.toString(), {
            method: "POST"
        });

    }

    // static async getUserProfile(senderIgsid: string) {
    //   let url = new URL(`${process.env.apiUrl}/${senderIgsid}`);
    //   //@ts-ignore
    //   url.search = new URLSearchParams({
    //     access_token: process.env.pageAccesToken,
    //     fields: "first_name, last_name, gender, locale, timezone"
    //   });
    //   let response = await fetch(url.toString());
    //   if (response.ok) {
    //     let userProfile = await response.json();
    //     return {
    //       //@ts-ignore
    //       firstName: userProfile.first_name,
    //       //@ts-ignore
    //       lastName: userProfile.last_name,
    //       //@ts-ignore
    //       gender: userProfile.gender,
    //       //@ts-ignore
    //       locale: userProfile.locale,
    //       //@ts-ignore
    //       timezone: userProfile.timezone
    //     };
    //   } else {
    //     console.warn(
    //       `Could not load profile for ${senderIgsid}: ${response.statusText}`,
    //       await response.json()
    //     );
    //     return null;
    //   }
    // }

    // static async getPersonaAPI() {
    //   console.log(`Fetching personas for app ${process.env.appId}`);
    //
    //   let url = new URL(`${process.env.apiUrl}/me/personas`);
    //   //@ts-ignore
    //   url.search = new URLSearchParams({
    //     access_token: process.env.pageAccesToken
    //   });
    //   let response = await fetch(url.toString());
    //   if (response.ok) {
    //     let body = await response.json();
    //     return body.data;
    //   } else {
    //     console.warn(
    //       `Unable to fetch personas for ${process.env.appId}: ${response.statusText}`,
    //       await response.json()
    //     );
    //     return null;
    //   }
    // }

    // static async postPersonaAPI(name:any, profile_picture_url:any) {
    //   let requestBody = {
    //     name,
    //     profile_picture_url
    //   };
    //   console.log(`Creating a Persona for app ${process.env.appId}`);
    //   console.log({ requestBody });
    //   let url = new URL(`${process.env.apiUrl}/me/personas`);
    //   //@ts-ignore
    //   url.search = new URLSearchParams({
    //     access_token: process.env.pageAccesToken
    //   });
    //   let response = await fetch(url.toString(), {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(requestBody)
    //   });
    //   if (response.ok) {
    //     console.log(`Request sent.`);
    //     let json = await response.json();
    //     return json.id;
    //   } else {
    //     console.error(
    //       `Unable to postPersonaAPI: ${response.statusText}`,
    //       await response.json()
    //     );
    //   }
    // }

    // static async callNLPConfigsAPI() {
    //   console.log(`Enable Built-in NLP for Page ${process.env.pageId}`);
    //
    //   let url = new URL(`${process.env.apiUrl}/me/nlp_configs}/me/nlp_configs`);
    //   url.search = new URLSearchParams({
    //     access_token: process.env.pageAccesToken,
    //     nlp_enabled: true
    //   });
    //   let response = await fetch(url.toString(), {
    //     method: "POST"
    //   });
    //   if (response.ok) {
    //     console.log(`Request sent.`);
    //   } else {
    //     console.error(`Unable to activate built-in NLP: ${response.statusText}`);
    //   }
    // }
}

export default GraphApi;

