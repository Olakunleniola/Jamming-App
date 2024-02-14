
export function Register ({registerRequest}) {
    return (
        <>
            <div className="register">
                <p>
                    Welcome, You need to register to use this app, this is due to spotify API usage <a href="https://developer.spotify.com/policy">policy</a>.<br/>
                    Please click the button below to register
                </p>
                <button id="login-but" onClick={registerRequest}>Register</button>
            </div>
        </>
    )
}