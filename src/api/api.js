const clientId = '605cdd5e4e4b4e7e814af71a371f3a7b';
const clientSecret = '76c6ae3255604ecc9ac8bcd84f80fef7';
// const credentials = `${clientId}:${clientSecret}`;
const refresh_token = "AQDA6e8xp3xwPqlK4lP3_Ma7X1UGpz8FYh8oojgobbRIEmkCC8IFe3jdqmBLEJjtPbH64KpwFDt5jzEpwOWGVMpN2lVI09tjQAm30qL5Ados6kEd32lo7vE430M388cNB8s"



export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:8080/callback");
    params.append("code_verifier", verifier);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    if(response.hasOwnProperty("error")){console.log(response.error)}
    const result = await response.json();
    const {access_token, refresh_token } = result;
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
}


export async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:8080/callback");
    params.append("scope", "user-read-private user-read-email playlist-modify-private playlist-modify-public");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}


export async function getSongs(search, token) {
    const url = `https://api.spotify.com/v1/search?q=${search}&type=track`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`
        }
    })

    return await response.json() 
}

export const getRefreshToken = async () => {

    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refresh_token') || refresh_token;
    const url = "https://accounts.spotify.com/api/token";
 
    const payload = {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       body: new URLSearchParams({
         grant_type: 'refresh_token',
         refresh_token: refreshToken,
         client_id: clientId
       }),
     }

    const body = await fetch(url, payload);
    const response = await body.json();
    localStorage.setItem('refresh_token', response.refreshToken);
    return response.accessToken;
}


export const createPLaylist = async(name, token, userId) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: `Created using the Jamming App...`,
            public: false
        })
    })
    return await response.json()
}


export const addTracksToSpotifyPlaylist = async (playlist_id, uris, token) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:  JSON.stringify({
            uris: uris,
            position: 0
        }),
    })

    return await response.json()
}

// Get User Profile Infomation
export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

// Helper Functions from Spotify documentation https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}




