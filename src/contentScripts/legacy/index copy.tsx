/* eslint-disable no-console */
import UrlPattern from "url-pattern";

import * as modules from "./modules";
import "./module";

const randID = () => Math.floor(Math.random() * 100000).toString();

const promises: { [id: string]: (v: any) => void } = {};
const callbacks: { [id: string]: (v: any) => void } = {};

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  window.addEventListener("message", function (event) {
    if (event.data.type === "FROM_PAGE") {
      if (event.data.callback) {
        if (callbacks[event.data.id]) {
          callbacks[event.data.id](event.data.data);
        }
      } else if (promises[event.data.id]) {
        promises[event.data.id](event.data.data);
      }
    }
  });

  const mods = Object.entries(modules).filter(i =>
    i[1].urls.some(url => new UrlPattern(url).match(location.href))
  );

  const script = document.createElement("script");
  const textContent = `window.__CZ__BROWSEACTIONS = {${mods
    .map(
      i =>
        `"${i[0]}": {${Object.entries(i[1].actions)
          .map(
            i =>
              `${i[0]}: ${i[1]
                ?.toString()
                .replace(/^async [^(\s]+\(([^)]*)\)/, "async ($1) => ")
                .replace(/^[^(\s]+\(([^)]*)\)/, "($1) => ")}`
          )
          .join(",")}}`
    )
    .join(",")}};
window.addEventListener("message", async (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type === "FROM_CZ__BROWSE")) {
    window.postMessage({type: "FROM_PAGE", id: event.data.id, data: await __CZ__BROWSEACTIONS[event.data.module][event.data.name](...event.data.data.map(i => {
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

  try {
  for (const [moduleKey, module] of mods) {
    module.enable(
      Object.fromEntries(
        Object.entries(module.actions).map(i => [
          i[0],
          (...data: any[]) => {
            const id = randID();
            window.postMessage({
              type: "FROM_CZ__BROWSE",
              module: moduleKey,
              name: i[0],
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
            return new Promise(resolve => {
              promises[id] = resolve;
            });
          },
        ])
      ) as any
    );
  }
  } catch (e: any) {
    const script = document.createElement("script");
    script.textContent = `console.log(\`${e.toString().replace("`", "\\`")}\`)`;
    document.body.appendChild(script);
  }
})();
