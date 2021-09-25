import { useEffect, useState } from "react";
import { sendMessage } from "webext-bridge";
import browser from "webextension-polyfill";

export async function getFromStorage<T>(key: string): Promise<T | null> {
  return (await browser.storage.local.get({ [key]: null }))[key] as T | null;
}

export async function setInStorage<T>(key: string, value: T): Promise<void> {
  return await browser.storage.local.set({ [key]: value });
}

function useLocalStorage<T>(key: string): [T | null, (value: T) => Promise<void>] {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    (async () => {
      setValue(await getFromStorage<T>(key))
    })();
  }, [key])
  return [value, async (value) => {
    setValue(value);
    await setInStorage<T>(key, value);
  }];
}

export function useStorageDemo() {
  return useLocalStorage<string>("webext-demo");
}

export function useEnabledPlugins() {
  const [value, setValue] = useLocalStorage<{ [key: string]: boolean }>("@czbrowse/plugins/enabled");
  return [
    value ?? {},
    async (value: { [key: string]: boolean }) => {
      await setValue(value);
      sendMessage("enabledPluginsChanged", {}, "background");
    },
  ] as const;
}
