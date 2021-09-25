import { BrowseBackgroundPlugin, BrowseContentPlugin } from "../_plugin";
import browser from "webextension-polyfill";
// import ReactDOM from "react-dom";
// import React from "react";
// import { Main } from "./main";

export class MapRewriteBackgroundPlugin extends BrowseBackgroundPlugin {
  name = "Map Rewrite";
  id = "maprewrite";
  urls = ["*www.munzee.com/map*", "*/munzee.com/map*"];

  defaultOn = false;
  listener: any = null;

  async start() {
    this.listener = (
      details: browser.WebRequest.OnBeforeRequestDetailsType
    ): undefined | browser.WebRequest.BlockingResponseOrPromise => {
      return {
        cancel: true,
      };
    };
    browser.webRequest.onBeforeRequest.addListener(
      this.listener,
      {
        urls: [
          "*://www.munzee.com/javascript/map/new_mapbox.js",
          "*://munzee.com/javascript/map/new_mapbox.js",
        ],
      },
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

export class MapRewritePlugin extends BrowseContentPlugin {
  name = "Map Rewrite";
  id = "maprewrite";
  urls = ["*www.munzee.com/map*", "*/munzee.com/map*"];

  defaultOn = false;

  async execute() {
    const mainWrapper = document.querySelector<HTMLElement>("#map-page > .showcase > .row");
    if (mainWrapper) {
      mainWrapper.parentElement!.classList.remove("showcase-top");
      mainWrapper.classList.remove("row");
      const headerHeight = document.querySelector<HTMLElement>(
        ".navbar.navbar-default.navbar-fixed-top"
      )!.clientHeight;
      mainWrapper.style.paddingTop = `${headerHeight}px`;
      mainWrapper.innerHTML = `
<iframe
  style="border: none;"
  id="inlineFrameExample"
  title="Map Rewrite"
  width="100%"
  height="300px"
  src="${browser.runtime.getURL("./dist/plugins/MapRewrite/index.html")}#${encodeURIComponent(JSON.stringify({}))}">
</iframe>`;
    }
  }
}
