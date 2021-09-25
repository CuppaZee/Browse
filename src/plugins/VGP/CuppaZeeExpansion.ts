import { BrowseContentPlugin } from "../_plugin";

export class VGPExpansionPlugin extends BrowseContentPlugin {
  name = "CuppaZee Expansion Pack";
  id = "vgp_expansion";
  urls = ["*gardenpainter.ide.sk/*"];
  category = "Virtual Garden Painter";

  async injectTypes(data: any) {
    const w = window as any;
    w.categories = data.data.categories;
    w.munzees.unshift(...data.data.types);
    w._initMunzeeTypes = w.initMunzeeTypes;
    w.initMunzeeTypes = function (c: any) {
      w._initMunzeeTypes(c);

      const a = document.getElementById("munzee-types")!;
      a.style.width = "1000px";
      a.style.maxWidth = "95vw";
      a.style.height = "auto";
      a.style.maxHeight = "160px";
      a.style.overflow = "auto";
    };
    w.mt = [];
    for (var c = 0; c < w.munzees.length; c++) {
      w.mt[w.munzees[c][0]] = [];
      w.mt[w.munzees[c][0]][0] = w.munzees[c][1];
      w.mt[w.munzees[c][0]][1] = w.munzees[c][2];
      w.mt[w.munzees[c][0]][2] = w.munzees[c][4];
      w.mt[w.munzees[c][0]][3] = c;
      w.mt[w.munzees[c][0]][4] = w.munzees[c][5];
    }

    let ___mt = w.mt;
    w.mt = new Proxy(___mt, {
      get: function (target, prop) {
        if (!target[prop]) {
          alert(`Invalid Type: ${prop.toString()}`);
          location.reload();
          throw "err";
        }
        return target[prop];
      },
    });
    w.initMunzeeTypes(0);
  }
  async getExistingTypes() {
    const w = window as any;
    return w.munzees;
  }

  async loadTypes() {
    const munzees: any[] = await this.inject(this.getExistingTypes)();
    const response = await fetch(
      `https://server.cuppazee.app/vgpexpansionpack?version=1.1.1&list=${encodeURIComponent(
        munzees.map(i => i[1]).join(",")
      )}`
    );
    return await response.json();
  }

  async setupStyles() {
    document.head.innerHTML =
      document.head.innerHTML +
      `<style>
    body.dark #toolbox,
body.dark #munzee-types,
body.dark div.maptilesbtn,
body.dark input.permalinktext,
body.dark input.permalinkcopy,
body.dark .permalink,
body.dark span.permalinkcopy {
  background-color: #212121;
  color: white;
}
body.dark div.maptilesbtn:hover,
body.dark span.permalinkcopy:hover {
  background-color: #111111;
  color: white;
}
body.dark span.announcement a:link,
body.dark span.announcement a:visited {
  color: #64c5ff;
}
#catalogList {
  position: sticky;
  top: -8px;
  background: white;
}
body.dark #catalogList {
  background-color: #212121;
}
body.dark img.sel,
body.dark img.sel32 {
  filter: invert(1);
}
body.dark .cat_active {
  color: white;
}
body.dark a.cat:hover {
  color: white;
}
body.darkMap img[src="cross.png"] {
  filter: invert(1);
}
    </style>
    `;
    const toolbox = document.getElementById("toolbox")!;
    toolbox.innerHTML =
      `<div style="display: inline-block; font-size: 50px; line-height: 1; vertical-align: super;" class="btn" title="Toggle Dark Mode" onclick="document.body.classList.toggle('dark');localStorage.vgpDark = document.body.classList.contains('dark') ? '1' : '0'">🌗</div>` +
      toolbox.innerHTML;

    if (localStorage.vgpDark == "1") {
      document.body.classList.add("dark");
    }
  }

  async checkForLegacyScript() {
    if (
      Array.from(document.querySelectorAll(".maptilesbtn")).find(i =>
        (i as any).innerText.includes("Wiki")
      )
    ) {
      alert(
        "The VGP Satellite Userscript is no longer supported. Please disable that Userscript and enabled the VGP CuppaZee Expansion Pack userscript instead."
      );
    }
    setTimeout(() => {
      if (
        Array.from(document.querySelectorAll(".maptilesbtn")).find(i =>
          (i as any).innerText.includes("Wiki")
        )
      ) {
        alert(
          "The VGP Satellite Userscript is no longer supported. Please use the VGP CuppaZee Expansion Pack which now includes an improved version of this function."
        );
      }
    }, 5000);
  }

  async injectMapStyles() {
    const w = window as any;
    w.setMapTileServer = function (a: number) {
      w.map.attributionControl.removeAttribution(w.attribution);
      document.body.classList.remove("darkMap");
      switch (a) {
        case 0:
          w.tileLayer.setUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
          w.attribution =
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 2:
          w.tileLayer.setUrl(
            "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=7f3cbdea0bff40f7b45139691a8c83ef"
          );
          w.attribution =
            'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 3:
          w.tileLayer.setUrl(
            "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=7f3cbdea0bff40f7b45139691a8c83ef"
          );
          w.attribution =
            'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 4:
          w.tileLayer.setUrl(
            "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
          );
          w.attribution =
            '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 5:
          w.tileLayer.setUrl(
            "https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=7qsgWErAr36tSql1JHhZ"
          );
          w.attribution =
            '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 6:
          w.tileLayer.setUrl(
            "https://api.maptiler.com/maps/darkmatter/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
          );
          w.attribution =
            '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          document.body.classList.add("darkMap");
          break;
        case 7:
          w.tileLayer.setUrl(
            "https://api.maptiler.com/maps/topo/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
          );
          w.attribution =
            '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
        case 8:
          w.tileLayer.setUrl(
            "https://api.maptiler.com/maps/pastel/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
          );
          w.attribution =
            '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
          break;
      }
      w.map.attributionControl.addAttribution(w.attribution);
      w.setCookie("maptype", a, 365);
    };
    w.setMapTileServer(w.maptype);
    document.getElementById(
      "maptiles"
    )!.innerHTML = `<div class="maptilesbtn" onclick="setMapTileServer(0)">OpenStreetMap</div>
<div class="maptilesbtn" onclick="setMapTileServer(2)">Thunderforest Outdoors</div>
<div class="maptilesbtn" onclick="setMapTileServer(3)">Thunderforest Neighbourhood</div>
<div class="maptilesbtn" onclick="setMapTileServer(4)">MapTiler Streets</div>
<div class="maptilesbtn" onclick="setMapTileServer(5)">MapTiler Satellite</div>
<div class="maptilesbtn" onclick="setMapTileServer(6)">MapTiler Dark</div>
<div class="maptilesbtn" onclick="setMapTileServer(7)">MapTiler Topo</div>
<div class="maptilesbtn" onclick="setMapTileServer(8)">MapTiler Pastel</div>
<div class="permalink">Permalink:<br><input class="permalinktext" type="text" id="permalinktext" value="" readonly="">&nbsp;<span title="Copy permalink" class="permalinkcopy" onclick="permaLinkCopy(4)">&nbsp;Copy&nbsp;</span></div>`;
  }

  async execute() {
    const data = await this.loadTypes();
    this.inject(this.injectTypes)(data);

    this.setupStyles();

    this.inject(this.injectMapStyles)();

    this.checkForLegacyScript();
  }
}
