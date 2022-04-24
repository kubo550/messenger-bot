import fetch from 'cross-fetch';
import { URL, URLSearchParams } from 'url';

class GraphApi {
  static async callSendApi(requestBody: any) {
    const url = new URL(`${process.env.apiUrl}/me/messages`);
    url.search = new URLSearchParams({
      access_token: process.env.pageAccessToken,
    }).toString();

    return await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  }

  static async callMessengerProfileAPI(requestBody: any): Promise<any> {
    console.log(`Setting Messenger Profile for app ${process.env.appId}`);
    const url = new URL(`${process.env.appUrl}/me/messenger_profile`);

    url.search = new URLSearchParams({
      access_token: process.env.pageAccessToken,
    }).toString();

    return fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  }

  static async callSubscriptionsAPI(customFields?: string): Promise<any> {
    const webhookUrl = `${process.env.appUrl}/webhook`;
    console.log(
      `Setting app ${process.env.appId} callback url to ${webhookUrl}`,
    );

    let fields =
      'messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals';

    if (customFields !== undefined) {
      fields = fields + ', ' + customFields;
    }

    const url = new URL(
      `${process.env.apiUrl}/${process.env.appId}/subscriptions`,
    );

    url.search = new URLSearchParams({
      access_token: process.env.pageAccessToken,
      object: 'page',
      callback_url: webhookUrl,
      verify_token: process.env.verifyToken,
      fields: fields,
      include_values: 'true',
    }).toString();

    return fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static async callSubscribedApps(customFields?: string) {
    console.log(
      `Subscribing app ${process.env.appId} to page ${process.env.pageId}`,
    );
    const fields = `messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals${
      customFields ? ', ' + customFields : ''
    }`;

    // I don't know why, but it works only with invalid typescript syntax
    const url = new URL(
      `${process.env.apiUrl}/${process.env.appId}/subscriptions`,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    url.search = new URLSearchParams({
      access_token: `${process.env.appId}|${process.env.appSecret}`,
      object: 'page',
      callback_url: `${process.env.appUrl}/webhook`,
      verify_token: process.env.verifyToken,
      fields: fields,
      include_values: 'true',
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default GraphApi;
