import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";

const version: 2 | 3 = process.argv.includes("--v3") ? 3 : 2;

export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest & { [key: string]: unknown } = {
    manifest_version: version,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    [version === 2 ? "browser_action" : "action"]: {
      default_icon: "./assets/icon-512.png",
      default_popup: "./dist/popup/index.html",
    },
    // options_ui: {
    //   page: './dist/options/index.html',
    //   open_in_tab: true,
    //   chrome_style: false,
    // },
    background:
      version === 2
        ? {
            page: "./dist/background/index.html",
            // scripts: ["./dist/background/main.js"],
            persistent: true,
          }
        : undefined,
    icons: {
      16: "./assets/icon-512.png",
      48: "./assets/icon-512.png",
      128: "./assets/icon-512.png",
    },
    permissions: [
      "tabs",
      "storage",
      "activeTab",
      // \/ DISABLE IF SAFARI
      ...(version === 2 ? ["webRequest", "webRequestBlocking"] : []),
      // /\ DISABLE IF SAFARI
      ...(version === 2 ? ["http://*/", "https://*/"] : []),
    ],
    host_permissions: version === 3 ? ["http://*/", "https://*/"] : undefined,
    content_scripts: [
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["./dist/contentScripts/index.global.js"],
      },
    ],
    web_accessible_resources:
      version === 2
        ? ["dist/contentScripts/style.css"] //, "dist/plugins/MapRewrite/index.html"]
        : [
            {
              resources: ["dist/contentScripts/style.css"], //, "dist/plugins/MapRewrite/index.html"],
              matches: ["http://*/*", "https://*/*"],
            },
            {
              resources: ["assets/inject.js"],
              matches: ["http://*/*", "https://*/*"],
            },
          ],
    content_security_policy:
      version === 2
        ? "script-src 'self' https://api.mapbox.com https://events.mapbox.com blob: ; object-src 'self' https://*.mapbox.com blob: ;"
        : undefined,
  };

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;
    manifest.permissions?.push("webNavigation");

    // this is required on dev for Vite script to load
    if (typeof manifest.content_scripts === "string") {
      manifest.content_security_policy = manifest.content_security_policy
        ?.toString()
        .replace("script-src 'self'", `script-src \'self\' http://localhost:${port}`);
    } else {
      manifest.content_security_policy = {
        // @ts-expect-error
        ...manifest.content_security_policy,
      };
    }
  }

  return manifest;
}
