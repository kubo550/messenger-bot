import GraphApi from './graph';

export class Profile {
  constructor(private appUrl: string, private shopUrl: string) {}

  public async setWebhook() {
    await GraphApi.callSubscriptionsAPI();
    await GraphApi.callSubscribedApps();
  }

  public async setPageFeedWebhook() {
    await GraphApi.callSubscriptionsAPI('feed');
    await GraphApi.callSubscribedApps('feed');
  }

  private async getGetStarted() {
    return {
      get_started: {
        payload: 'GET_STARTED',
      },
    };
  }

  public async setGetStarted() {
    const getStartedPayload = this.getGetStarted();
    await GraphApi.callMessengerProfileAPI(getStartedPayload);
  }

  private getPersistentMenu() {
    return [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            title: 'Plan zajęć',
            type: 'postback',
            payload: 'SCHEDULE',
          },
        ],
      },
    ];
  }

  async setPersistentMenu() {
    const persistentMenu = this.getPersistentMenu();
    await GraphApi.callMessengerProfileAPI(persistentMenu);
  }

  private getWhitelistedDomains() {
    return {
      whitelisted_domains: [this.appUrl, this.shopUrl],
    };
  }

  setWhitelistedDomains() {
    const domainPayload = this.getWhitelistedDomains();
    return GraphApi.callMessengerProfileAPI(domainPayload);
  }

  public async init() {
    console.log('1');
    await this.setWebhook();
    console.log('2');
    await this.setGetStarted();
    console.log('3');
    await this.setPersistentMenu();
    console.log('4');
    await this.setWhitelistedDomains();
  }
}
