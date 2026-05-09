const TEMPLATE_ID = 95206881;
const PROXY = "https://corsproxy.io/?"; 

function showTab(t) {
    document.getElementById('sec-u').style.display = t === 'u' ? 'block' : 'none';
    document.getElementById('sec-p').style.display = t === 'p' ? 'block' : 'none';
    document.getElementById('btnU').className = t === 'u' ? 'nav-btn active' : 'nav-btn';
    document.getElementById('btnP').className = t === 'p' ? 'nav-btn active' : 'nav-btn';
}

function addLog(text, type) {
    const log = document.getElementById('log');
    const time = new Date().toLocaleTimeString([], {hour12: false});
    const entry = document.createElement('div');
    if (type === "success") entry.className = "log-success";
    if (type === "error") entry.className = "log-error";
    if (type === "fail") entry.className = "log-fail";
    entry.innerHTML = `[${time}] ${text}`;
    log.prepend(entry);
}

async function createUniverse() {
    const key = document.getElementById('apiKey').value;
    const name = document.getElementById('expName').value || "frozePublish Game";
    if(!key) return addLog("ERROR: API Key is missing!", "error");

    addLog(`Task: Creating "${name}"...`, "");
    
    try {
        const target = encodeURIComponent('https://apis.roblox.com/universes/v1/universes');
        const response = await fetch(PROXY + target, {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID, "displayName": name })
        });
        
        const data = await response.json();
        
        if(data.universeId) {
            addLog("SUCCESS! Universe ID: " + data.universeId, "success");
            addLog("Now copy that ID and use the 'Place' tab.", "success");
        } else {
            addLog("FAILED: Check permissions in Dashboard.", "fail");
        }
    } catch (e) {
        addLog("ERROR: Proxy timeout. Try again.", "error");
    }
}

async function addPlace() {
    const key = document.getElementById('apiKey').value;
    const uniId = document.getElementById('uniId').value;
    if(!key || !uniId) return addLog("ERROR: Missing Key or ID!", "error");

    addLog(`Task: Adding place to ${uniId}...`, "");

    try {
        const target = encodeURIComponent(`https://apis.roblox.com/universes/v1/universes/${uniId}/places`);
        const response = await fetch(PROXY + target, {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID })
        });
        const data = await response.json();
        
        if(data.placeId) {
            addLog("SUCCESS! Place Added ID: " + data.placeId, "success");
            addLog("Your game is now ready on Roblox!", "success");
        } else {
            addLog("FAILED: Invalid Universe ID.", "fail");
        }
    } catch (e) {
        addLog("ERROR: Connection failed.", "error");
    }
}
