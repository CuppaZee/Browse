import { BrowseBackgroundPlugin, BrowseContentPlugin } from "~/plugins/_plugin";
import * as pluginsObject from "../plugins/_plugins";

export const plugins: (BrowseContentPlugin | BrowseBackgroundPlugin)[] = [];
for (const pluginName in pluginsObject) {
  const pluginClass = pluginsObject[pluginName as keyof typeof pluginsObject];
  // @ts-expect-error
  const plugin = new pluginClass();
  if (!plugins.find(i => i.id === plugin.id)) {
    plugins.push(plugin);
  }
}
