import { onMessage } from "webext-bridge";
import browser from "webextension-polyfill";
import { loadDB } from "~/logic/db";
import { getFromStorage } from "~/logic";
import { BrowseBackgroundPlugin } from "~/plugins/_plugin";
import * as pluginsObject from "~/plugins/_plugins";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log("Extension installed");
});

onMessage("enabledPluginsChanged", async () => {
  runPlugins();
  return null;
});

const plugins: BrowseBackgroundPlugin[] = [];
async function setupPlugins() {
  const db = await loadDB();

  for (const pluginName in pluginsObject) {
    const pluginClass = pluginsObject[pluginName as keyof typeof pluginsObject];

    if (pluginClass.TYPE === "background") {
      plugins.push(new pluginClass(db));
    }
  }

  runPlugins();
}

async function runPlugins() {
  const enabledPlugins =
    (await getFromStorage<{ [key: string]: boolean }>("@czbrowse/plugins/enabled")) ?? {};
  for (const plugin of plugins) {
    try {
      if (enabledPlugins[plugin.id] ?? plugin.defaultOn) {
        if (!plugin.running) {
          await plugin.start();
          plugin.running = true;
        }
      } else {
        if (plugin.running) {
          await plugin.stop();
          plugin.running = false;
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  }
}

setupPlugins();
