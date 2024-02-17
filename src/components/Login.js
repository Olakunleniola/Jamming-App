import React from "react"
import { redirectToAuthCodeFlow } from "../api/api";

export function LogIn() {
    return (
        <>
            <div id="loginError"></div>
            <div className="login">
                <h1>Welcome to the <span className="jam">Ja<span className="min">mm</span>ing</span> App</h1>
                <p>Create your custom playlists here and save them directly to your Spotify account.</p>
                <button id="login-but" onClick={async() => await redirectToAuthCodeFlow()}>Login to Spotify</button>
            </div>
        </>
    )
}
