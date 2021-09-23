// export type Action<A extends any = any, B extends any = any, C extends any = any> = [A, B, C?];
// export type w = Window & { [key: string]: any };

// export interface BrowseModule<Actions extends { [key: string]: Action } = {}> {
//   name: string;
//   id: string;
//   urls: string[];
//   enable: (
//     actions: {
//       [K in keyof Actions]: (
//         data: Actions[K][0],
//         callback?: (data: Actions[K][2]) => void
//       ) => Promise<Actions[K][1]>;
//     }
//   ) => void;
//   actions: {
//     [K in keyof Actions]: (
//       window: w,
//       data: Actions[K][0],
//       callback: (data: Actions[K][2]) => void
//     ) => Actions[K][1];
//   };
// }

export type Action<A extends any[] = any[], B extends any = any> = (...params: A) => Promise<B>;
export type w = Window & { [key: string]: any };

export interface BrowseModule<Actions extends {[key: string]: Action }> {
  name: string;
  id: string;
  urls: string[];
  actions: Actions;
  enable: (
    actions: Actions
  ) => void;
}

export function createBrowseModule<Actions extends { [key: string]: Action } = {}>(
  properties: Pick<BrowseModule<{}>, "name" | "id" | "urls">,
  actions: Actions,
  enable: (actions: Actions) => void
): BrowseModule<Actions> {
  return {
    ...properties,
    actions,
    enable,
  };
}