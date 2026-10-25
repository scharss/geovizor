# geovizor

geovizor is a fast, browser-based editor for spatial data.
It provides an interactive map, drawing tools, a feature editor, bulk editing,
and import/export support for common geospatial formats.

## Features

- Create and edit spatial data (geometries and properties) in the browser.
- Import and export GeoJSON, GeoJSONL, KML, KMZ, CSV, TopoJSON, Shapefile,
  FlatGeobuf, WKT, GPX, TCX, GeoTIFF, XLS/XLSX, OSM, and other formats.
- Draw points, lines, polygons, rectangles, and circles.
- Edit properties in bulk with the Feature Editor or Table Panel.
- Share datasets through compressed URL parameters.
- Use custom raster layers and switch between basemaps.
- Portable static build that works at the domain root or in any subdirectory.

## Requirements

- [Node.js](https://nodejs.org/) **20.19.4 or newer**
- npm **10.13.1** (recommended; newer npm versions also work, but may print an
  engine warning)

## Setup

From the project root:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_PUBLIC_MAPBOX_TOKEN=pk.your_public_mapbox_token
```

The token must be a **public** Mapbox token starting with `pk.`. Do not use a
secret token starting with `sk.` in client-side code.

The token is embedded in the production JavaScript at build time. Restrict it
to your deployment domain in the Mapbox dashboard when possible.

## Development

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173/
```

## Production Build

```bash
npm run build
```

The static output is generated in:

```text
dist/
```

## Preview the Production Build

Do not open `dist/index.html` using `file://`; browsers block ES modules and
fetches from local files. Serve the directory over HTTP instead:

```bash
python -m http.server 8080 --directory dist
```

Open:

```text
http://127.0.0.1:8080/
```

Alternatively, use:

```bash
npx vite preview --host 127.0.0.1 --port 4173
```

## Deployment

Upload the **contents** of `dist/` to the web root where geovizor should live.
For example, on HestiaCP for a subdirectory named `geovizor`:

```text
public_html/geovizor/
├── index.html
├── manifest.json
├── about.md
├── LICENSE.txt
├── assets/
├── cursors/
└── layer-icons/
```

The resulting URL is:

```text
https://example.com/geovizor/
```

The build uses relative asset paths, so the same output can be deployed at the
domain root or under another directory without rebuilding.

### Updating a deployment

1. Back up the current deployment if necessary.
2. Remove the previous static files from the target directory.
3. Upload the new ZIP or the contents of `dist/`.
4. Extract it directly into the target directory, not into a nested `dist/`.
5. Confirm that `index.html` is at the root of the deployment directory.
6. Reload with `Ctrl + F5` to bypass cached assets.

## Mapbox Notes

- The Mapbox access token is public client-side configuration and will be
  visible in the generated JavaScript.
- The **Satellite** basemap uses Mapbox Satellite Streets raster tiles through
  the Static Tiles API. This avoids the Raster Tiles API restriction that
  Standard Satellite can encounter with some Mapbox tokens.
- If the Mapbox token or account gains unrestricted raster tile access,
  Standard Satellite can be restored in `app/lib/default_styles.ts`.
- Basemap labels in the Satellite raster layer are part of the tile imagery and
  are not controlled by the "Show map labels" option.

## Project Structure

```text
app/          Application components, state, and map logic
pages/        Vite entry point
public/       Static assets copied to dist/
state/        Global application state
styles/       Global styles
vite.config.ts
```

## Attribution and License

geovizor is a derivative of
[geojson.io](https://github.com/mapbox/geojson.io), originally created by Mapbox
and contributors. GeoJSON is the underlying open format used by the editor.

This project retains the original ISC license and copyright notice. See
[LICENSE](./LICENSE) for the full text.

Upstream references:

- [Original geojson.io repository](https://github.com/mapbox/geojson.io)
- [GeoJSON specification](https://geojson.org/)
- [Mapbox](https://www.mapbox.com/)
