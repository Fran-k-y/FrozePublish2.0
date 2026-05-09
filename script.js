const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbxNl4rXRw2Lj6F9gVBNRScbIQHCbLToXphT-H3-LhzhzAAA_Ldsnwyd7hmofkLxzthm/exec";
const TEMPLATE_ID = 95206881;

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
    const name = document.getElementById('expName').value || "Studio Lite Game";
    if(!key) return addLog("ERROR: NO KEY", "error");

    addLog("Bridge: Contacting Roblox...");
    try {
        const response = await fetch(BRIDGE_URL, {
            method: 'POST',
            body: JSON.stringify({
                key: key,
                url: 'https://apis.roblox.com/universes/v1/universes',
                payload: { "templatePlaceId": TEMPLATE_ID, "displayName": name }
            })
        });
        const data = await response.json();
        
        if(data.universeId) {
            addLog("SUCCESS! Universe ID: " + data.universeId, "success");
            document.getElementById('targetUniId').value = data.universeId;
        } else {
            addLog("FAIL: " + (data.message || "Check Key Permissions"), "fail");
        }
    } catch (e) { 
        addLog("BRIDGE ERROR: Check Deployment Settings", "error"); 
    }
}

async function runAddPlace() {
    const key = document.getElementById('apiKey').value.trim();
    const uniId = document.getElementById('targetUniId').value.trim();
    if(!key || !uniId) return addLog("ERROR: MISSING DATA", "error");

    addLog("Bridge: Adding Start Place...");
    try {
        const response = await fetch(BRIDGE_URL, {
            method: 'POST',
            body: JSON.stringify({
                key: key,
                url: `https://apis.roblox.com/universes/v1/universes/${uniId}/places`,
                payload: { "templatePlaceId": TEMPLATE_ID }
            })
        });
        const data = await response.json();
        if(data.placeId) {
            addLog("SUCCESS! Place ID: " + data.placeId, "success");
        } else {
            addLog("FAIL: Invalid Universe ID", "fail");
        }
    } catch (e) { 
        addLog("BRIDGE ERROR", "error"); 
    }
}
