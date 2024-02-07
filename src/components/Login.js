export function LogIn({handleLogin}) {
    
    return (
        <div className="login">
            <h1>Welcome to <span className="jam">Ja<span className="min">mm</span>ing</span> App</h1>
            <p>You can create custom play-list here and Save it directly to your Spotify App</p>
            <button id="login-but" onClick={handleLogin}>Login to Spotify</button>
        </div>
    )
}
