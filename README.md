# India Governance & Budget Dashboard

**🔴 Live demo:** [apoorvkhanna.github.io/govt-dashboard](https://apoorvkhanna.github.io/govt-dashboard/)

An interactive, single-page dashboard combining two views of Indian governance behind a simple **tabbed interface**:

1. **🗺️ Constituency Map** — a [Leaflet.js](https://leafletjs.com/) map of India's parliamentary constituencies. Click a constituency to see the MP's details and key work in a sidebar.
2. **💸 Budget Cash Flow** — a [Plotly.js](https://plotly.com/javascript/) **Sankey diagram** visualizing fiscal federalism: how money flows from revenue sources (taxes) into the Centre and State pools, and then down to Local bodies and final expenditures.

> The budget figures are **hypothetical relative proportions** intended to illustrate the *concept* of devolution and expenditure — not official accounting.

## Tech stack

- Plain HTML / CSS / JavaScript (no build step)
- [Leaflet.js 1.9.4](https://leafletjs.com/) — interactive map
- [Plotly.js 2.27.0](https://plotly.com/javascript/) — Sankey diagram
- CARTO basemap tiles

## Running locally

The constituency map fetches a local GeoJSON file (`india_pc_2024.geojson`) via `fetch()`, which browsers block when opening `index.html` directly from the filesystem (`file://`). **Serve the folder over HTTP:**

```bash
# Python 3
python3 -m http.server 8000

# Node (npx, no install)
npx serve .

# VS Code: install the "Live Server" extension,
# then right-click index.html -> "Open with Live Server"
```

Then open <http://localhost:8000> in your browser.

## Constituency map data

The boundary file [`india_pc_2024.geojson`](india_pc_2024.geojson) (~5 MB, 542 constituencies) is **included** in this repo. It is the simplified parliamentary-constituency boundary set from [DataMeet](https://github.com/datameet/maps) (`parliamentary-constituencies/india_pc_2019_simplified.geojson`) — boundaries are unchanged for 2024, since no delimitation has occurred since.

Each feature's `properties` contains only:

- `PC_NAME` — the constituency name (e.g. `"Varanasi"`)
- `PC_ID` — numeric id

This file has **no state field**, so [`script.js`](script.js) supplies the state for the constituencies it has MP data for (via the `stateByPC` map) and shows a dash (`—`) for any other clicked constituency. If you swap in a richer GeoJSON that includes `ST_NAME`/`st_name`, the sidebar uses that automatically.

Constituency names that match a key in the `mpDatabase` object in [`script.js`](script.js) (currently `Varanasi` and `Wayanad` as samples) show full MP details; others show a "Data pending update" placeholder. Extend `mpDatabase` (and `stateByPC`) to add more MPs.

## Project structure

```text
.
├── index.html              # Tab layout + script/style includes
├── style.css               # Tabs, map/sidebar layout, Sankey container
├── script.js               # Tab switching, Leaflet map, Plotly Sankey
├── india_pc_2024.geojson   # Constituency boundaries (DataMeet, simplified)
└── README.md
```

## Data & disclaimer

- Constituency boundaries: [DataMeet/maps](https://github.com/datameet/maps) (Creative Commons).
- MP details in `mpDatabase` are illustrative samples.
- Budget figures in the Sankey diagram are **hypothetical relative proportions** to illustrate the concept of fiscal devolution — not official accounting.
