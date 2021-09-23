import { BrowseModule } from "../types";

declare global {
  interface Window {
    toggleIcon(i: string): void;
    $: any;
    mapMarkers: any;
    mapSandbox: any;
    circle: any;
    quick_deploy: any;
    map: any;
    onCameraChanged: any;
    mapboxgl: any;
    username: any;
    htmlrep: any;
  }
}

export const Map_Sandbox: BrowseModule = {
  name: "Map Sandbox",
  id: "map_sandbox",
  options: {},
  urls: ["munzee.com/map/**", "munzee.com/map", "www.munzee.com/map", "www.munzee.com/map/**"],
  enable(w: Window) {
    console.log(w, w.$);
    setInterval(() => {
      console.log('ooo', w.$)
    }, 3000);
    let hidden: string[] = [];
    w.toggleIcon = function (i) {
      if (hidden.includes(i)) {
        w.$(`.mapboxgl-marker[style*="${i}"]`).css("visibility", "visible");
        hidden = hidden.filter(x => x != i);
      } else {
        w.$(`.mapboxgl-marker[style*="${i}"]`).css("visibility", "hidden");
        hidden.push(i);
      }
    };
    console.log("enabling")
    var d = document.createElement("div");
    d.innerHTML = `<div id="filters"></div>`;
    var xd = d.firstChild;
    // @ts-ignore
    console.log("aaaa", w.$, w.jQuery);
    w.$("#inputbar")[0].append(xd); //${w.$('#inputbar')[0].innerHTML}`;
    console.log("aabb");
    setInterval(function () {
      var obj: any = {};
      var arr = Object.values(w.mapMarkers);
      // w.$(`.mapboxgl-marker`).css("visibility", "visible");
      for (let i of hidden) {
        w.$(`.mapboxgl-marker[style*="${i}"]`).css("visibility", "hidden");
      }
      for (let i = 0; i < arr.length; i++) {
        var a: any = arr[i];
        var ic = a._element.style.backgroundImage.slice(5, -2);
        obj[ic] = (obj[ic] || 0) + 1;
      }
      var x: any[] = Object.entries(obj);
      x.sort((a, b) => b[1] - a[1]);
      var y =
        `<h4>Advanced Filtering Functionality is experimental</h4>` +
        x
          .map(
            i => `
            <div onclick="toggleIcon('${i[0]}')" style="display:inline-block;border:1px solid ${
              hidden.includes(i[0]) ? "red" : "green"
            };background-color:${
              hidden.includes(i[0]) ? "#ffaaaa" : "#aaffaa"
            };padding:4px;margin:2px;border-radius:4px;">
               <img src="${i[0]}" style="height:32px;width:32px;"/><br/>
               ${i[1]}
            </div>
        `
          )
          .join("");
      if (
        window
          .$("#filters")[0]
          .innerHTML.toLowerCase()
          .replace(/[^0-9a-zA-Z]/g, "") != y.toLowerCase().replace(/[^0-9a-zA-Z]/g, "")
      )
        w.$("#filters")[0].innerHTML = y;
    }, 100);
    console.log("bbbb");
    w.$('[id*="SB"]').removeClass("hidden-xs");
    console.log("ccc");
    w.$("#showSBbuttons").click(function () {
      setTimeout(function () {
        w.$('[id*="SB"]').removeClass("hidden-xs");
        w.mapSandbox.createItemElement = function (item: any) {
          var imageurl = "https://i.ibb.co/3RKyg0m/Grey-Single-Surprise.png";
          var fn = w.htmlrep(w.username);

          var el = document.createElement("div");
          el.className = "marker map-box-sb-marker";
          el.style.width = `32px`;
          el.style.height = `32px`;
          el.style.cursor = "pointer";
          el.style.setProperty("background-size", "32px 32px", "important");
          el.style.zIndex = "10000000";
          el.style.backgroundImage = "url(" + imageurl + ")";
          el.addEventListener(
            "click",
            function (this: any, e: any) {
              e.stopPropagation();
              this.showItemPopup(item);
            }.bind(this)
          );
          el.click();
          var bbtn = w.$("button.mapboxgl-popup-close-button").click();
          return el;
        };
        w.mapSandbox.circles.basicScatter = { radius: 762, color: "#72ea5d" };
        w.mapSandbox.circles.catapultScatter = { radius: 402.336, color: "#b56000" };
        w.mapSandbox.circles.bowlingScatter = { radius: 228.6, color: "#00b52d" };
        w.mapSandbox.circles.joystickScatter = { radius: 457.2, color: "#b50087" };
        w.mapSandbox.circles.joystickSecondScatter = { radius: 213.36, color: "#8800b5" };
        w.mapSandbox.circles.capturePOI = { radius: 304.8, color: "#ff5500" };
        w.mapSandbox.showItemPopup = function (item: any) {
          w.map.panTo(item.coordinates);
          w.onCameraChanged();
          this.removePopup();
          this.selectedId = item.id;

          this.itemPopup = new w.mapboxgl.Popup({
            closeButton: false,
            offset: 10,
            anchor: "left",
          });

          var itemContent = "<section id='createNewItem' style='text-align:center;'>";
          itemContent +=
            "<input class=\"hidden-xs form-control\" style='margin-bottom: 5px;' id='popup_title' type='text' value='" +
            item.title +
            "'>";
          //itemContent += '<input  class="hidden-xs" style=\'margin-left: 10px;\' id=\'saveSBtitle\' type=\'button\' value=\'Save Title\'>';
          itemContent +=
            "<input style='margin-right: 10px;background-color:#aaffaa;' class='hidden-xs btn btn-md' id='openquickdeploymodal' type='button' value='Deploy' data-toggle=\"modal\" data-target=\"#quickdeploy_modal\">";
          itemContent +=
            "<input  class=\"hidden-xs btn btn-md\" style='background-color:#ffaaaa;' id='removeFromSB' type='button' value='Remove'>";
          itemContent +=
            '<span class="hidden-xs"><br />' +
            item.coordinates[1] +
            " " +
            item.coordinates[0] +
            "</span>";

          if (item.myOwn) {
            itemContent +=
              "<br />Own Munzee:<input style='margin-top: 5px; margin-left:10px;' type='checkbox' checked='checked' id='check_SB_own'/>";
          } else {
            itemContent +=
              "<br />Own Munzee:<input style='margin-top: 5px; margin-left:10px;' type='checkbox' id='check_SB_own'/>";
          }
          var captureAreas = [
            "virtual|captureArea|Virtual",
            "poi_filter|capturePOI|POI",
            "blast_capture|blastArea|Blast",
          ]
            .map(function (i) {
              return `<div style="display:inline-block;padding:4px;" id="newcheck_${
                i.split("|")[1]
              }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
            })
            .join("");
          itemContent += `<br /><div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:green;">Capture Areas</div>${captureAreas}</div>`;

          var blockAreas = [
            "motel|motelArea|Motel/Trail",
            "hotel|hotelArea|Hotel",
            "virtualresort|resortArea|Resort",
            "timeshare|tsArea|Timeshare",
            "vacationcondo|condoArea|Condo",
            "treehouse|treehouseArea|Treehouse",
            "airmystery|airArea|Air Mystery",
          ]
            .map(function (i) {
              return `<div style="display:inline-block;padding:4px;" id="newcheck_${
                i.split("|")[1]
              }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
            })
            .join("");
          itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:red;">Blocked Areas</div>${blockAreas}</div>`;

          var scatterAreas = [
            "scatter|basicScatter|Default",
            "catapult|catapultScatter|Catapult",
            "bowlingball|bowlingScatter|Bowling",
            "joystickfull|joystickScatter|Joystick",
            "joystickfull|joystickSecondScatter|Joystick #2",
          ]
            .map(function (i) {
              return `<div style="display:inline-block;padding:4px;" id="newcheck_${
                i.split("|")[1]
              }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
            })
            .join("");
          itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:blue;">Scatter Areas</div>${scatterAreas}</div>`;
          itemContent += "</section>";
          this.itemPopup.setLngLat(item.coordinates).setHTML(itemContent).addTo(w.map);

          for (var layer in w.mapSandbox.list[w.mapSandbox.selectedId].layers) {
            if (w.mapSandbox.list[w.mapSandbox.selectedId].layers[layer]) {
              w.$("#newcheckimg_" + layer).css("filter", "none");
              w.$("#newchecktext_" + layer).css("color", "green");
            }
          }

          w.$("#check_SB_own").change(function (this: any) {
            if (!this.checked) {
              w.mapSandbox.list[w.mapSandbox.selectedId].myOwn = 0;
              if (w.mapSandbox.list[w.mapSandbox.selectedId].layers.ownArea) {
                w.mapSandbox.removeLayer(w.mapSandbox.selectedId, "ownArea");
              }
            } else {
              w.mapSandbox.list[w.mapSandbox.selectedId].myOwn = 1;
              if (w.circle) {
                w.mapSandbox.drawCircle(w.mapSandbox.selectedId, "ownArea");
              }
            }
          });

          function generate(layer: any) {
            return function () {
              if (!w.mapSandbox.list[w.mapSandbox.selectedId].layers[layer]) {
                w.mapSandbox.drawCircle(w.mapSandbox.selectedId, layer);
                w.$("#newcheckimg_" + layer).css("filter", "none");
                w.$("#newchecktext_" + layer).css("color", "green");
              } else {
                w.mapSandbox.removeLayer(w.mapSandbox.selectedId, layer);
                w.$("#newcheckimg_" + layer).css("filter", "grayscale(1) opacity(0.4)");
                w.$("#newchecktext_" + layer).css("color", "red");
              }
            };
          }

          w.$("#newcheck_captureArea").click(generate("captureArea"));
          w.$("#newcheck_capturePOI").click(generate("capturePOI"));
          w.$("#newcheck_blastArea").click(generate("blastArea"));

          w.$("#newcheck_motelArea").click(generate("motelArea"));
          w.$("#newcheck_hotelArea").click(generate("hotelArea"));
          w.$("#newcheck_resortArea").click(generate("resortArea"));
          w.$("#newcheck_tsArea").click(generate("tsArea"));
          w.$("#newcheck_condoArea").click(generate("condoArea"));
          w.$("#newcheck_treehouseArea").click(generate("treehouseArea"));
          w.$("#newcheck_airArea").click(generate("airArea"));

          w.$("#newcheck_basicScatter").click(generate("basicScatter"));
          w.$("#newcheck_catapultScatter").click(generate("catapultScatter"));
          w.$("#newcheck_bowlingScatter").click(generate("bowlingScatter"));
          w.$("#newcheck_joystickScatter").click(generate("joystickScatter"));
          w.$("#newcheck_joystickSecondScatter").click(generate("joystickSecondScatter"));

          w.$("#popup_title").change(
            function (this: any) {
              this.list[this.selectedId].title = w.$("#popup_title").val();
            }.bind(this)
          );

          w.$("#removeFromSB").click(
            function (this: any) {
              this.removeSelected();
            }.bind(this)
          );
          let _this = this;
          window
            .$("#openquickdeploymodal")
            .off()
            .click(function () {
              _this.list[_this.selectedId].title = w.$("#popup_title").val();
              w.$("#quickdeployoptions").show();
              w.$("#quickdeploybody").empty();
            });

          window
            .$(".qd-type")
            .off()
            .click(function (this: any) {
              w.quick_deploy(
                w.mapSandbox.list[w.mapSandbox.selectedId].marker.getLngLat().lat,
                w.mapSandbox.list[w.mapSandbox.selectedId].marker.getLngLat().lng,
                w.$(this).data("typeid"),
                w.mapSandbox.list[w.mapSandbox.selectedId].title
              );
            });
        };
      }, 250);
    });
    console.log("done");
  },
};
