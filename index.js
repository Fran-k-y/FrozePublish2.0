const axios = require('axios');
const express = require('express');
const app = express();

const API_KEY = process.env['ROBLOX_API_KEY'];
const TEMPLATE_ID = 95206881; 

// --- THE MOBILE GUI ---
const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { background: #0a0a0a; color: white; font-family: 'Inter', sans-serif; text-align: center; padding: 15px; }
        .card { background: #181818; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid #333; max-width: 450px; margin: auto; }
        .tabs { display: flex; background: #222; border-radius: 12px; padding: 5px; margin-bottom: 25px; }
        .tab { flex: 1; padding: 12px; border-radius: 8px; cursor: pointer; color: #888; font-weight: bold; transition: 0.3s; }
        .tab.active { background: #00ff00; color: #000; }
        input { width: 100%; padding: 15px; margin: 15px 0; border-radius: 10px; border: 1px solid #444; background: #111; color: white; box-sizing: border-box; }
        .btn { width: 100%; padding: 18px; border: none; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; text-transform: uppercase; }
        .btn-uni { background: #00ff00; color: black; }
        .btn-place { background: #0088ff; color: white; }
        #status { margin-top: 25px; padding: 15px; border-radius: 10px; font-size: 14px; display: none; background: #222; border: 1px dashed #444; }
    </style>
</head>
<body>
    <div class="card">
        <h1 style="color:#00ff00; margin-top:0;">FROZE PUBLISH</h1>
        <div class="tabs">
            <div id="tab-u" class="tab active" onclick="setTab('u')">UNIVERSE</div>
            <div id="tab-p" class="tab" onclick="setTab('p')">PLACE</div>
        </div>

        <div id="view-u">
            <p style="color:#aaa;">Creates a new experience named <b>frozePublish</b></p>
            <button class="btn btn-uni" onclick="run('/create-universe')">CREATE UNIVERSE</button>
        </div>

        <div id="view-p" style="display:none;">
            <p style="color:#aaa;">Add a new place to an existing experience</p>
            <input type="text" id="targetId" placeholder="Universe ID (e.g. 12345678)">
            <button class="btn btn-place" onclick="addPlace()">ADD PLACE</button>
        </div>

        <div id="status"></div>
    </div>

    <script>
        function setTab(t) {
            document.getElementById('view-u').style.display = t === 'u' ? 'block' : 'none';
            document.getElementById('view-p').style.display = t === 'p' ? 'block' : 'none';
            document.getElementById('tab-u').className = t === 'u' ? 'tab active' : 'tab';
            document.getElementById('tab-p').className = t === 'p' ? 'tab active' : 'tab';
        }

        async function run(url) {
            const out = document.getElementById('status');
            out.style.display = 'block';
            out.innerHTML = '⚙️ SENDING TASK TO ROBLOX CLOUD...';
            
            try {
                const res = await fetch(url);
                const data = await res.json();
                if(data.universeId || data.placeId) {
                   out.style.borderColor = '#00ff00';
                   out.innerHTML = '<b style="color:#00ff00;">[SUCCESS]</b><br>ID: ' + (data.universeId || data.placeId);
                } else {
                   throw new Error();
                }
            } catch (e) {
                out.style.borderColor = '#ff4444';
                out.innerHTML = '<b style="color:#ff4444;">[FAILED]</b><br>Check API Key Permissions in Dashboard';
            }
        }

        function addPlace() {
            const id = document.getElementById('targetId').value;
            if(!id) return alert("Enter Universe ID!");
            run('/create-place?universeId=' + id);
        }
    </script>
</body>
</html>
`;

// --- THE BRAIN ---

app.get('/', (req, res) => res.send(HTML_CONTENT));

app.get('/create-universe', async (req, res) => {
    try {
        const response = await axios.post(
            'https://apis.roblox.com/universes/v1/universes',
            { "templatePlaceId": TEMPLATE_ID, "displayName": "frozePublish" },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) { res.status(500).json({ err: "API Error" }); }
});

app.get('/create-place', async (req, res) => {
    const { universeId } = req.query;
    try {
        const response = await axios.post(
            `https://apis.roblox.com/universes/v1/universes/${universeId}/places`,
            { "templatePlaceId": TEMPLATE_ID },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) { res.status(500).json({ err: "API Error" }); }
});

app.listen(3000, () => console.log("Studio Lite V1 Ready"));
