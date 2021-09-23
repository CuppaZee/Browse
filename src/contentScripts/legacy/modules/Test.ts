import { createBrowseModule } from "../types";

export const Test = createBrowseModule(
  {
    name: "Test",
    id: "test",
    urls: ["*.munzee.com/*"],
  },
  {
    async swap(data: string) {
      Array.from(window.$(data)).forEach((i: any) => (i.style.filter = "invert(1)"));
      return;
    },
    async s(callback: () => void) {
      console.log("a");
      callback();
    },
  },
  async ({ swap, s }) => {
    await swap("body");
    s(() => console.log("aaaa"));
  }
);
