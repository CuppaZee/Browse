import { BrowseContentPlugin } from "../_plugin";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

import geohash from "latlon-geohash";

export class MapPermalinksPlugin extends BrowseContentPlugin {
  name = "Map Permalinks";
  id = "mappermalinks";
  urls = ["*www.munzee.com/*", "*/munzee.com/*", "*calendar.munzee.com/*"];

  async getMapCenter() {
    return window.map.getCenter();
  }

  async execute() {
    setTimeout(async () => {
      const eventIndicator = document.querySelector(".event-indicator");
      if (eventIndicator) {
        const mapCenter = await this.inject(this.getMapCenter)();
        const link = `https://www.munzee.com/map/${geohash.encode(
          mapCenter.lat,
          mapCenter.lng,
          9
        )}/16.0`;
        eventIndicator.outerHTML =
          `<a style="color: black;" href="${link}">&nbsp;📌 Map Link</a>&nbsp;|&nbsp;` +
          eventIndicator.outerHTML;
      }
      const mapFormInputs = document.querySelectorAll<HTMLInputElement>("form#gotomap input");
      if (mapFormInputs.length > 0) {
        const values = Array.from(mapFormInputs).map(i => [i.name, i.value]);
        const link = `https://www.munzee.com/map/${geohash.encode(
          Number(values.find(i => i[0] === "latitude")?.[1]),
          Number(values.find(i => i[0] === "longitude")?.[1]),
          9
        )}/16.0`;
        document.querySelector("#locationimage")!.innerHTML =
          `<a href="${link}">&nbsp;📌 Map Link</a>` +
          document.querySelector("#locationimage")!.innerHTML;
      }
    }, 2000);
  }
}
