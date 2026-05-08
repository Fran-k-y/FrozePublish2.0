const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

const API_KEY = process.env['ROBLOX_API_KEY'];
const TEMPLATE_ID = 95206881;

// 1. Serve the GUI file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. The Logic to Create Universe
app.get('/create-universe', async (req, res) => {
    try {
        const response = await axios.post(
            'https://apis.roblox.com/universes/v1/universes',
            { "templatePlaceId": TEMPLATE_ID, "displayName": "frozePublish" },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

// 3. The Logic to Create Place
app.get('/create-place', async (req, res) => {
    const { universeId } = req.query;
    try {
        const response = await axios.post(
            `https://apis.roblox.com/universes/v1/universes/${universeId}/places`,
            { "templatePlaceId": TEMPLATE_ID },
            { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

app.listen(3000, () => console.log("Server running on Port 3000"));
