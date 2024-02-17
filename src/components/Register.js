
export function Register ({registerRequest}) {
    return (
        <>
            <div className="register">
                <p>
                    Welcome! To use this app, you must register due to Spotify API usage  <a href="https://developer.spotify.com/policy">policies</a>.<br/> Please click the button below to register
                </p>
                <button id="login-but" onClick={registerRequest}>Register</button>
            </div>
        </>
    )
}