const PROXY = "https://corsproxy.io/?";
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
    const key = document.getElementById('apiKey').value;
    const name = document.getElementById('expName').value || "New Game";
    if(!key) return addLog("MISSING API KEY", "error");

    addLog(`Creating Universe: ${name}...`);
    try {
        const url = PROXY + encodeURIComponent('https://apis.roblox.com/universes/v1/universes');
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID, "displayName": name })
        });
        const data = await res.json();
        if(data.universeId) {
            addLog(`SUCCESS! Universe ID: ${data.universeId}`, "success");
            document.getElementById('targetUniId').value = data.universeId;
        } else {
            addLog("FAILED: " + (data.message || "Check Permissions"), "fail");
        }
    } catch (e) { addLog("CONNECTION ERROR", "error"); }
}

async function runAddPlace() {
    const key = document.getElementById('apiKey').value;
    const uniId = document.getElementById('targetUniId').value;
    if(!key || !uniId) return addLog("MISSING KEY OR UNIVERSE ID", "error");

    addLog(`Adding Place to Universe ${uniId}...`);
    try {
        const url = PROXY + encodeURIComponent(`https://apis.roblox.com/universes/v1/universes/${uniId}/places`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID })
        });
        const data = await res.json();
        if(data.placeId) {
            addLog(`SUCCESS! Place ID: ${data.placeId}`, "success");
        } else {
            addLog("FAILED: Check if Universe ID is correct", "fail");
        }
    } catch (e) { addLog("CONNECTION ERROR", "error"); }
}
