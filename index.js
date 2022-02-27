const express = require('express');
const fetch = require("node-fetch");
const cors = require('cors')

const app = express();
app.use(cors())

const port = 3001;


// Initiate app
app.listen(port, () => {
    console.log('Listening, port ' + port);
});


app.get('/api/steam/getownedgames/:steamID', async (req, res) => {
    const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=5B92D9E3145BEEC9265C03504ACDAF1A&steamid=${req.params.steamID}&format=json&include_appinfo=true&include_played_free_games=true`)
    const data = await response.json();
    res.send(data.response.games)
})

app.get('/api/steam/getrecentgames/:steamID', async (req, res) => {
    const response = await fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=5B92D9E3145BEEC9265C03504ACDAF1A&steamid=${req.params.steamID}&format=json`)
    const data = await response.json();
    res.send(data.response.games)
})