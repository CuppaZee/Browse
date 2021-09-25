import { BrowseContentPlugin } from "./_plugin";

export class TestPlugin extends BrowseContentPlugin {
  name = "Your Script";
  id = "test";
  urls = ["*.munzee.com/*"];
  credit = "Your Name";
  category = "Example";

  async swap(data: string) {
    Array.from(window.$(data)).forEach((i: any) => (i.style.filter = "invert(1)"));
    return;
  }

  async execute() {
    await this.inject(this.swap)("html");
  }
};
