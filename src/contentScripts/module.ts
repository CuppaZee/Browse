export type InjectableFunction<A extends any[] = any[], B = any> = (...params: A) => Promise<B>;
export type InjectFunction = <T extends InjectableFunction>(func: T) => T;

export abstract class BrowseModuleClass {
  abstract name: string;
  abstract id: string;
  abstract urls: string[];
  inject: InjectFunction;

  constructor(inject: InjectFunction) {
    this.inject = inject;
  }
}
