/* =========================================
   1. TAB SWITCHING LOGIC
========================================= */
function switchTab(event, tabId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show the clicked tab and set button to active
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // CRITICAL: Leaflet maps glitch if loaded in a hidden div.
    // We must tell the map to recalculate its size when it becomes visible.
    if (tabId === 'mp-tab' && map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}

/* =========================================
   2. LEAFLET MAP LOGIC
========================================= */
const map = L.map('map').setView([22.5937, 78.9629], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

const mpDatabase = {
    "Varanasi": {
        name: "Narendra Modi",
        party: "Bharatiya Janata Party (BJP)",
        achievements: ["Initiated Kashi Vishwanath Corridor.", "Smart City development.", "Namami Gange infrastructure."]
    },
    "Wayanad": {
        name: "Priyanka Gandhi Vadra",
        party: "Indian National Congress (INC)",
        achievements: ["Eco-sensitive zone protections.", "Tribal welfare.", "Promoted local agricultural cooperatives."]
    }
};

function onFeatureClick(e) {
    const layer = e.target;
    const properties = layer.feature.properties;
    const constituencyName = properties.PC_NAME;
    const stateName = properties.ST_NAME;

    map.eachLayer(l => {
        if (l.options && l.options.color === 'red') l.setStyle({ color: '#3388ff', weight: 1, fillOpacity: 0.2 });
    });
    layer.setStyle({ color: 'red', weight: 2, fillOpacity: 0.5 });

    document.querySelector('.placeholder').classList.add('hidden');
    document.getElementById('mp-info').classList.remove('hidden');

    document.getElementById('constituency-name').innerText = constituencyName;
    document.getElementById('state-name').innerText = stateName;

    const mpData = mpDatabase[constituencyName];
    if (mpData) {
        document.getElementById('mp-name').innerText = mpData.name;
        document.getElementById('mp-party').innerText = mpData.party;
        const ul = document.getElementById('mp-achievements');
        ul.innerHTML = '';
        mpData.achievements.forEach(ach => {
            let li = document.createElement('li');
            li.innerText = ach;
            ul.appendChild(li);
        });
    } else {
        document.getElementById('mp-name').innerText = "Data pending update";
        document.getElementById('mp-party').innerText = "N/A";
        document.getElementById('mp-achievements').innerHTML = "<li>Awaiting latest official records.</li>";
    }
}

// Fetch GeoJSON (Requires live server)
fetch('india_pc_2024.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: { color: '#3388ff', weight: 1, fillOpacity: 0.2 },
            onEachFeature: (feature, layer) => { layer.on({ click: onFeatureClick }); }
        }).addTo(map);
    }).catch(e => console.log("Map GeoJSON not loaded. Ensure local server is running."));


/* =========================================
   3. CASH FLOW SANKEY DIAGRAM (PLOTLY)
========================================= */
// The Sankey diagram uses "Nodes" (entities) and "Links" (flow of money from Source Node to Target Node)
const data = {
    type: "sankey",
    orientation: "h",
    node: {
        pad: 20,
        thickness: 30,
        line: { color: "black", width: 0.5 },
        // Define all the entities involved in the budget flow
        label: [
            "Direct Taxes (Income/Corporate)", // 0
            "Indirect Taxes (GST/Customs)",    // 1
            "State Own Taxes (Excise/Property)",// 2
            "Union Budget (Centre)",           // 3
            "State Budgets",                   // 4
            "Local Budgets (City/Village)",    // 5
            "Central Exp. (Defence/Interest)", // 6
            "State Exp. (Salaries/Health/Police)", // 7
            "Local Exp. (Sanitation/Civic)"    // 8
        ],
        color: ["#2ecc71", "#2ecc71", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e74c3c", "#e74c3c", "#e74c3c"]
    },
    link: {
        // Source node index -> Target node index
        source: [0, 1, 1, 2, 3, 3, 4, 4, 5],
        target: [3, 3, 4, 4, 4, 6, 7, 5, 8],
        // Flow volume (hypothetical relative proportions to illustrate the concept)
        value:  [45, 30, 25, 35, 30, 45, 80, 10, 10],
        label: [
            "100% to Centre",
            "CGST/IGST to Centre",
            "SGST to States",
            "100% to States",
            "41% Devolution + Grants",
            "Retained by Centre",
            "State Expenditure",
            "State Finance Commission Grants",
            "Civic Expenditure"
        ]
    }
};

const layout = {
    title: "Simulated Flow of Public Funds in India",
    font: { size: 12 },
    margin: { l: 20, r: 20, t: 40, b: 20 }
};

// Render the chart in the designated div
Plotly.newPlot('sankey-chart', [data], layout, {responsive: true});
