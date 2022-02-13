const SteamAuth = require("node-steam-openid");

export const steam = new SteamAuth({
    realm: "http://localhost:3000", // Site name displayed to users on logon
    returnUrl: "http://localhost:3000/auth/steam/authenticate", // Your return route
    apiKey: "5B92D9E3145BEEC9265C03504ACDAF1A" // Steam API key
});