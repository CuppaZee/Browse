window.__CZ__BROWSEACTIONS = {};
window.addEventListener(
  "message",
  async event => {
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type === "ERROR_CZ__BROWSE") {
      console.error(event.data.data);
    }
    if (event.data.type && event.data.type === "INJECT_CZ__BROWSE") {
      eval(event.data.body);
      window.postMessage({
        type: "FROM_PAGE",
        id: `inject__${event.data.id}`,
        data: null,
      });
    }

    if (event.data.type && event.data.type === "FROM_CZ__BROWSE") {
      window.postMessage({
        type: "FROM_PAGE",
        id: event.data.id,
        data: await __CZ__BROWSEACTIONS[event.data.function](
          ...event.data.data.map(i => {
            if (i.type === "CALLBACK") {
              return data => {
                window.postMessage({ type: "FROM_PAGE", id: i.value, data: data, callback: true });
              };
            }
            return i.value;
          })
        ),
      });
    }
  },
  false
);
