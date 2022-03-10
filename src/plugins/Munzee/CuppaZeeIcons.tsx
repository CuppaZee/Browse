import { BrowseBackgroundPlugin } from "../_plugin";
import browser from "webextension-polyfill";

export class CuppaZeeIconsPlugin extends BrowseBackgroundPlugin {
  name = "CuppaZee Icons";
  id = "cuppazeeicons";
  urls = ["*www.munzee.com/*", "*/munzee.com/*"];

  defaultOn = false;

  listener: any = null;

  async start() {
    this.listener = (details: browser.WebRequest.OnBeforeRequestDetailsType) => {
      let type = this.db.getType(details.url);
      if (type) {
        return {
          redirectUrl: `https://images.cuppazee.app/types/128/${type.strippedIcon}.png`,
        };
      }
    };
    browser.webRequest.onBeforeRequest.addListener(
      this.listener,
      { urls: ["*://munzee.global.ssl.fastly.net/images/pins/*"] },
      ["blocking"]
    );
  }

  async stop() {
    if (this.listener !== null) {
      browser.webRequest.onBeforeRequest.removeListener(this.listener);
      this.listener = null;
    }
  }
}
