import React from "react";
import { useEnabledPlugins } from "~/logic/storage";
// import browser from "webextension-polyfill";
import { plugins } from "~/logic/plugins";

// function openOptionsPage() {
//   browser.runtime.openOptionsPage();
// }

export default function Popup() {
  const [enabledPlugins, setEnabledPlugins] = useEnabledPlugins();
  return (
    <main className="min-w-[300px] text-gray-700 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
      <div className="text-center text-lg p-2 font-bold">CuppaZee Browse</div>
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {[...new Set(plugins.map(i => i.category))].map(category => (
          <div>
            <div className="flex flex-row bg-gray-100 dark:bg-gray-800 items-center px-2 py-1">
              <div className="flex-grow">{category}</div>
            </div>
            {plugins
              .filter(i => i.category === category)
              .sort((a, b) => ([a.name, b.name].sort()[0] === b.name ? 1 : -1))
              .map(i => (
                <div className="flex flex-row items-center px-2 py-1">
                  <div className="flex-grow">
                    <div>{i.name}</div>
                    {i.credit && <div className="text-xs">{i.credit}</div>}
                  </div>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setEnabledPlugins({
                        ...enabledPlugins,
                        [i.id]: !(enabledPlugins[i.id] ?? i.defaultOn),
                      });
                    }}
                    checked={enabledPlugins[i.id] ?? i.defaultOn}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
      {/* <button className="btn m-2 align-stretch" onClick={openOptionsPage}>
        Open Settings
      </button> */}
    </main>
  );
}
