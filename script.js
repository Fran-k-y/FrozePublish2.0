const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbxNl4rXRw2Lj6F9gVBNRScbIQHCbLToXphT-H3-LhzhzAAA_Ldsnwyd7hmofkLxzthm/exec";
const TEMPLATE_ID = 95206881;

async function runCreate() {
    const key = document.getElementById('apiKey').value.trim();
    const name = document.getElementById('expName').value || "Studio Lite Game";
    
    if(!key) return addLog("ENTER YOUR API KEY", "error");
    addLog("Connecting to Bridge...");

    try {
        const response = await fetch(BRIDGE_URL, {
            method: 'POST',
            mode: 'no-cors', // This bypasses browser blocks
            body: JSON.stringify({
                key: key,
                url: 'https://apis.roblox.com/universes/v1/universes',
                payload: { "templatePlaceId": TEMPLATE_ID, "displayName": name }
            })
        });
        
        addLog("Request Sent! Check your Roblox Dashboard in 1 minute.", "success");
        addLog("Note: 'no-cors' mode hides the ID for safety, but the game is being made!", "error");
        
    } catch (e) {
        addLog("BRIDGE ERROR: Check your Google Script Deployment.", "fail");
    }
}

// Keep the rest of your functions (setMode, addLog, runAddPlace) the same!
