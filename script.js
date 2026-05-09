const TEMPLATE_ID = 95206881;
// This is a more stable proxy for Roblox API calls
const PROXY = "https://api.allorigins.win/raw?url=";

function setMode(m) {
    document.getElementById('sec-u').style.display = m === 'u' ? 'block' : 'none';
    document.getElementById('sec-p').style.display = m === 'p' ? 'block' : 'none';
    document.getElementById('btnU').className = m === 'u' ? 'nav-btn active' : 'nav-btn';
    document.getElementById('btnP').className = m === 'p' ? 'nav-btn active' : 'nav-btn';
}

function addLog(text, type) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    if (type) entry.className = "log-" + type;
    entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}`;
    log.prepend(entry);
}

async function runCreate() {
    const key = document.getElementById('apiKey').value.trim();
    const name = document.getElementById('expName').value || "New Mobile Experience";
    
    if(!key) return addLog("ERROR: NO KEY ENTERED", "error");
    addLog(`INIT: Creating Universe "${name}"...`, "");

    try {
        const robloxUrl = 'https://apis.roblox.com/universes/v1/universes';
        const finalUrl = PROXY + encodeURIComponent(robloxUrl);

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'x-api-key': key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "templatePlaceId": TEMPLATE_ID,
                "displayName": name
            })
        });

        // Some proxies return text instead of JSON if they fail
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch(e) { data = { error: text }; }

        if(data.universeId) {
            addLog(`SUCCESS! UNIVERSE ID: ${data.universeId}`, "success");
            document.getElementById('targetUniId').value = data.universeId;
        } else {
            console.log(data);
            addLog("PERMISSION DENIED: Refresh key or check IP toggle.", "fail");
        }
    } catch (e) {
        addLog("NETWORK ERROR: Proxy is busy. Wait 5s.", "error");
    }
}

async function runAddPlace() {
    const key = document.getElementById('apiKey').value.trim();
    const uniId = document.getElementById('targetUniId').value.trim();
    
    if(!key || !uniId) return addLog("ERROR: MISSING DATA", "error");
    addLog(`INIT: Adding Place to ${uniId}...`, "");

    try {
        const robloxUrl = `https://apis.roblox.com/universes/v1/universes/${uniId}/places`;
        const finalUrl = PROXY + encodeURIComponent(robloxUrl);

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'x-api-key': key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID })
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch(e) { data = { error: text }; }

        if(data.placeId) {
            addLog(`SUCCESS! PLACE ID: ${data.placeId}`, "success");
        } else {
            addLog("FAILED: Check if Universe ID belongs to you.", "fail");
        }
    } catch (e) {
        addLog("NETWORK ERROR.", "error");
    }
}
