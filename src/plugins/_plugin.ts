export type InjectableFunction<A extends any[] = any[], B = any> = (...params: A) => Promise<B>;
export type InjectFunction = <T extends InjectableFunction>(func: T) => T;

import type { CuppaZeeDB } from "@cuppazee/db";

export interface PluginExecuteProps {
  db: CuppaZeeDB;
}

export class BrowseContentPlugin {
  static TYPE: "content" = "content";
  name: string = "";
  id: string = "";
  urls: string[] = [];
  credit?: string | null = null;
  category: string = "Munzee Website";
  inject: InjectFunction;
  db: CuppaZeeDB;
  defaultOn: boolean = true;

  constructor(inject: InjectFunction, db: CuppaZeeDB) {
    this.inject = inject;
    this.db = db;
  }

  execute(): Promise<void> {
    throw "An execute function must be declared.";
  }
}


export class BrowseBackgroundPlugin {
  static TYPE: "background" = "background";
  name: string = "";
  id: string = "";
  urls: string[] = [];
  credit?: string | null = null;
  category: string = "Munzee Website";
  db: CuppaZeeDB;
  running: boolean = false;
  defaultOn: boolean = true;

  constructor(db: CuppaZeeDB) {
    this.db = db;
  }

  start(): Promise<void> {
    throw "A start function must be declared.";
  }

  stop(): Promise<void> {
    throw "A stop function must be declared.";
  }
}
