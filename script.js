const TEMPLATE_ID = 95206881;

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
    
    // Applying colors based on your request
    if (type === "success") entry.className = "log-success";
    if (type === "error") entry.className = "log-error";
    if (type === "fail") entry.className = "log-fail";
    
    entry.innerHTML = `[${time}] ${text}`;
    log.prepend(entry);
}

async function createUniverse() {
    const key = document.getElementById('apiKey').value;
    if(!key) return addLog("ERROR: API Key is missing!", "error");

    addLog("Task 1 Sent: Creating Universe...", "");
    
    try {
        const response = await fetch('https://apis.roblox.com/universes/v1/universes', {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID, "displayName": "frozePublish" })
        });
        const data = await response.json();
        
        if(data.universeId) {
            addLog("SUCCESS: Created ID " + data.universeId, "success");
        } else {
            addLog("FAILED: Roblox denied creation.", "fail");
        }
    } catch (e) {
        addLog("ERROR: Connection blocked (CORS). Check Dashboard.", "error");
    }
}

async function addPlace() {
    const key = document.getElementById('apiKey').value;
    const uniId = document.getElementById('uniId').value;
    if(!key || !uniId) return addLog("ERROR: Missing Info!", "error");

    addLog("Task 2 Sent: Adding Place...", "");

    try {
        const response = await fetch(`https://apis.roblox.com/universes/v1/universes/${uniId}/places`, {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ "templatePlaceId": TEMPLATE_ID })
        });
        const data = await response.json();
        
        if(data.placeId) {
            addLog("SUCCESS: Place Added! ID: " + data.placeId, "success");
        } else {
            addLog("FAILED: Place creation failed.", "fail");
        }
    } catch (e) {
        addLog("ERROR: API request failed.", "error");
    }
}
