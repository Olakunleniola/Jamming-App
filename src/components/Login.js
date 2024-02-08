import React from "react"
import { redirectToAuthCodeFlow } from "../api/api";

export function LogIn() {
    return (
        <>
            <div id="loginError"></div>
            <div className="login">
                <h1>Welcome to <span className="jam">Ja<span className="min">mm</span>ing</span> App</h1>
                <p>You can create custom play-list here and Save it directly to your Spotify App</p>
                <button id="login-but" onClick={async() => await redirectToAuthCodeFlow()}>Login to Spotify</button>
            </div>
        </>
    )
}
