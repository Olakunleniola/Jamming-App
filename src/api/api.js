const clientId = '605cdd5e4e4b4e7e814af71a371f3a7b';
const clientSecret = '76c6ae3255604ecc9ac8bcd84f80fef7';
const credentials = `${clientId}:${clientSecret}`;


//  Get client access token 
export async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(credentials)
        },
        body: 'grant_type=client_credentials'})
    
    const {access_token} = await response.json()
    localStorage.setItem('qry_Tk', access_token);
    return access_token
}

// request for user's accesstoken
export async function getUserAccessToken(code) {
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

    const result = await response.json();
    const accessToken = result.access_token;
    localStorage.setItem("refreshToken", result.refresh_token)
    localStorage.setItem("acc_tk", accessToken)
    return accessToken;
}

//  Redirect user to login to the spotify account
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

// Request to get Tracks 
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

//  Get refreshToken Request
export const getRefreshToken = async () => {

    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem('refreshToken');
    const url = "https://accounts.spotify.com/api/token";
 
    const payload = {
       method: 'POST',
       headers: {
        'Authorization': 'Basic ' + btoa(credentials),
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
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.accessToken;
}

// Create a new api request
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

//  Add tracks to user's jamming app created playlist on spotify
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

// Get User Profile Infomation from spotify
export async function fetchProfile(token) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
        const data = await response.json()
        localStorage.setItem("usr_dt", JSON.stringify(data))
        return data
    }else {
        return response
    }
}

// Get user registration information
export async function checkUserRegistered(email){
    const response = await fetch(`https://flask-jamming-app-email-api.onrender.com/spotify/user/${email}`);
    const data = await response.json();
    if (data.registered){
        localStorage.setItem("reg", true);
    }
    return data;
}   

// make user registration request
export async function requestToRegister(username, email) {
    const response = fetch("https://flask-jamming-app-email-api.onrender.com/spotify/mail", 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name:username,
                email:email
            }),
        }
    )
    return await response
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




