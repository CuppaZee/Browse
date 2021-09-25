import { BrowseContentPlugin } from "../_plugin";

export class ConvertPlugin extends BrowseContentPlugin {
  name = "Better Convert";
  id = "convert";
  urls = ["*/munzee.com/m/*/*/admin/convert/", "*/www.munzee.com/m/*/*/admin/convert/"];
  credit = "Originally by CzPeet";

  async execute() {
    document.head.innerHTML += `
    <style>
    #admin-munzee-convert-page .type img, #admin-munzee-swap-page .type img {
      height: 44px;
    }
    </style>`;

    const convertItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#admin-munzee-convert-page .type, #admin-munzee-swap-page .type"
      )
    );
    for (const item of convertItems) {
      const img = item.querySelector("img");
      if (img) {
        // Insert Name Label
        const type = this.db.getType(img.src);
        const name = type?.name ?? this.db.strip(img.src);
        const label = document.createElement("small");
        label.style.textAlign = "center";
        label.style.whiteSpace = "nowrap";
        label.style.overflow = "hidden";
        label.style.textOverflow = "ellipsis";
        label.style.width = "100%";
        label.innerText = name.replace("Virtual ", "");
        img.insertAdjacentElement("afterend", label);

        // Remove Margin on Number
        const number = item.querySelector("h5");
        if (number) {
          number.style.margin = "0px";
        }

        // Remove Column Padding
        item.style.padding = "0px";

        // Remove Margin on Number
        const link = item.querySelector("a");
        if (link) {
          link.style.display = "flex";
          link.style.flexDirection = "column";
          link.style.alignItems = "center";
        } else {
          item.style.display = "flex";
          item.style.flexDirection = "column";
          item.style.alignItems = "center";
          item.style.opacity = "0.6";
        }
      }
    }
  }
};
