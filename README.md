# India Governance & Budget Dashboard

An interactive, single-page dashboard combining two views of Indian governance behind a simple **tabbed interface**:

1. **🗺️ Constituency Map** — a [Leaflet.js](https://leafletjs.com/) map of Indian parliamentary constituencies. Click a constituency to see the MP's details and key work in a sidebar.
2. **💸 Budget Cash Flow** — a [Plotly.js](https://plotly.com/javascript/) **Sankey diagram** visualizing fiscal federalism: how money flows from revenue sources (taxes) into the Centre and State pools, and then down to Local bodies and final expenditures.

> The budget figures are **hypothetical relative proportions** intended to illustrate the *concept* of devolution and expenditure — not official accounting.

## Tech stack

- Plain HTML / CSS / JavaScript (no build step)
- [Leaflet.js 1.9.4](https://leafletjs.com/) — interactive map
- [Plotly.js 2.27.0](https://plotly.com/javascript/) — Sankey diagram
- CARTO basemap tiles

## Running locally

The constituency map fetches a local GeoJSON file (`india_pc_2024.geojson`) via `fetch()`, which browsers block when opening `index.html` directly from the filesystem (`file://`). **You must serve the folder over HTTP.**

Pick any one of these:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx, no install)
npx serve .

# VS Code
# Install the "Live Server" extension, then right-click index.html → "Open with Live Server"
```

Then open <http://localhost:8000> in your browser.

## Adding the constituency map data

This repo does **not** include the boundary file. To make the map interactive, add a GeoJSON of India's 2024 parliamentary constituencies to the project root as:

```
india_pc_2024.geojson
```

The code expects each feature's `properties` to contain:

- `PC_NAME` — the constituency name (e.g. `"Varanasi"`)
- `STATE_NAME` — the state name

Constituency names that match a key in the `mpDatabase` object in [`script.js`](script.js) (currently `Varanasi` and `Wayanad` as samples) will show full MP details; others show a "Data pending update" placeholder. Extend `mpDatabase` to add more.

Without the GeoJSON the page still loads — the map shows the base tiles and the Budget Cash Flow tab works fully; the console logs `"Map GeoJSON not loaded."`.

## Project structure

```
.
├── index.html   # Tab layout + script/style includes
├── style.css    # Tabs, map/sidebar layout, Sankey container
├── script.js    # Tab switching, Leaflet map, Plotly Sankey
└── README.md
```
