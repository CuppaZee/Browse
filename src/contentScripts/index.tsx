/* eslint-disable no-console */
import UrlPattern from "url-pattern";

import * as pluginsObject from "../plugins/_plugins";
import { BrowseContentPlugin, InjectFunction } from "../plugins/_plugin";
import { getFromStorage } from "~/logic";
import { loadDB } from "~/logic/db";

declare global {
  interface Window {
    toggleIcon(i: string): void;
    $: any;
    mapMarkers: any;
    mapSandbox: any;
    circle: any;
    quick_deploy: any;
    map: any;
    onCameraChanged: any;
    mapboxgl: any;
    username: any;
    htmlrep: any;
  }
}

const randID = () => Math.floor(Math.random() * 100000).toString();

const callbacks: { [id: string]: (v: any) => void } = {};
const functionIDs = new Map<unknown, string>();

function injectNewFunction(id: string, func: Function) {
  const script = document.createElement("script");
  script.textContent = `window.__CZ__BROWSEACTIONS["${id}"] = ${func
    .toString()
    .replace(/^async [^(\s]+\(([^)]*)\)/, "async ($1) => ")
    .replace(/^[^(\s]+\(([^)]*)\)/, "($1) => ")}`;
  document.body.appendChild(script);
}

const injectFunction: InjectFunction = func => {
  if (!functionIDs.has(func)) {
    functionIDs.set(func, randID());
    injectNewFunction(functionIDs.get(func) ?? "", func);
  }
  return ((...data: any[]) =>
    new Promise(resolve => {
      const funcId = functionIDs.get(func);
      const id = randID();
      window.postMessage({
        type: "FROM_CZ__BROWSE",
        function: funcId,
        data: data.map(i => {
          if (i && typeof i === "function") {
            const s = randID();
            callbacks[s] = i;
            return { type: "CALLBACK", value: s };
          }
          return { type: "VALUE", value: i };
        }),
        id,
      });
      callbacks[id] = resolve;
    })) as any;
};

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(async () => {
  window.addEventListener("message", function (event) {
    if (event.data.type === "FROM_PAGE") {
      if (callbacks[event.data.id]) {
        callbacks[event.data.id](event.data.data);
      }
    }
  });

  const script = document.createElement("script");
  const textContent = `window.__CZ__BROWSEACTIONS = {};
window.addEventListener("message", async (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type === "FROM_CZ__BROWSE")) {
    window.postMessage({type: "FROM_PAGE", id: event.data.id, data: await __CZ__BROWSEACTIONS[event.data.function](...event.data.data.map(i => {
      if(i.type === "CALLBACK") {
        return (data) => {
          window.postMessage({type: "FROM_PAGE", id: i.value, data: data, callback: true});
        }
      }
      return i.value;
    }))})
  }
}, false);`;
  script.textContent = textContent;
  document.body.appendChild(script);

  const db = await loadDB();

  const enabledPlugins =
    (await getFromStorage<{ [key: string]: boolean }>("@czbrowse/plugins/enabled")) ?? {};

  const plugins: BrowseContentPlugin[] = [];
  for (const pluginName in pluginsObject) {
    const pluginClass = pluginsObject[pluginName as keyof typeof pluginsObject];

    if (pluginClass.TYPE === "content") {
      plugins.push(new pluginClass(injectFunction, db));
    }
  }

  for (const plugin of plugins) {
    try {
      if (
        (enabledPlugins[plugin.id] ?? plugin.defaultOn) &&
        plugin.urls.some(url => new UrlPattern(url).match(location.href))
      ) {
        await plugin.execute();
      }
    } catch (e: any) {
      const script = document.createElement("script");
      script.textContent = `console.error(\`${e.toString().replace("`", "\\`")}\`)`;
      document.body.appendChild(script);
    }
  }
})();
