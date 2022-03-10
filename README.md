# CuppaZee Browse

Based on [`vite-react-webext`](https://github.com/sohcah/vite-react-webext)

## Building for Firefox

Assuming PNPM and NodeJS are installed on your machine:

### Install Dependencies
```
pnpm install
```

### Build Extension
```
pnpm run build_v2
```

### Pack Extension
```
pnpm run pack
```

You can now find the output in `extension.zip` and `extension.xpi`.

## Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**.

For Firefox developers, you can run the following command instead:

```bash
pnpm start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

## Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.