import { BrowseModuleClass } from "../module";

export class TestModule extends BrowseModuleClass {
  name = "Test"
  id = "test"
  urls = ["*.munzee.com/*"]

  async swap(data: string) {
    Array.from(window.$(data)).forEach((i: any) => (i.style.filter = "invert(1)"));
    return;
  }

  async execute () {
    await this.inject(this.swap)("html");
  }
};
