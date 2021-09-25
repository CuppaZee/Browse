import { CuppaZeeDB, loadFromLzwJson } from "@cuppazee/db";
import { getFromStorage, setInStorage } from ".";

export async function loadDB() {
  try {
    const storageValue = await getFromStorage<[number, string]>("@czbrowse/dbcache/v1");
    if (storageValue && storageValue[0] > Date.now() - 1800000) {
      return loadFromLzwJson(storageValue[1]).db;
    }
  } catch {}
  const response = await fetch(`https://db.cuppazee.app/lzw/0`);
  const data = await response.text();
  if (data.length > 0) {
    const { db } = loadFromLzwJson(data);
    setInStorage("@czbrowse/dbcache/v1", [Date.now(), data]);
    return db;
  }
  return new CuppaZeeDB([],[],[])
}
