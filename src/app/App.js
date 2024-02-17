import React from "react";
import {useState, useEffect} from "react";
import '../jamming.css';
import { LogIn } from "../components/Login";
import { UserAllowed } from "../components/UserAllowed";
import {
  fetchProfile, 
  getSongs, 
  getRefreshToken,
  createPLaylist,
  addTracksToSpotifyPlaylist,
  getUserAccessToken,
  requestToRegister,
  checkUserRegistered,
  getAccessToken
} from "../api/api"
import { Register } from "../components/Register";


function App() { 
  // initislize variables 
  const [code, setCode] = useState("")
  const [accessToken, setAccessToken ] = useState("");
  const [queryToken, setQueryToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [query, setQuery] = useState("");
  const [trackData, setTrackData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [message, setMessage] = useState({});
  const [registered, setRegistered] = useState(true);
  const [registerPending, setRegisterPending] = useState(false);


  // Get user access token and profile data if authenticated
  useEffect(() => {
    // Get All the data the app requires
    async function fetchData(){
      //Check if accesstoken is stored in the localstorage in case of page reload
      // if  not exist make API request else dont s
      const acc_tk = localStorage.getItem("acc_tk"); 
      if (!acc_tk) {
        const userToken = await getUserAccessToken(code);
        handleError(userToken)
        if(!userToken){
          setAuthenticated(false)
          localStorage.clear()
          setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
        }
        setAccessToken(userToken)
      }else {
        setAccessToken(acc_tk)
      }

      // Check if query token exist in the localStorage
      // Make an API request if not exist else dont  
      const qry_token = localStorage.getItem("qry_Tk")
      if (!qry_token ){
        const tkn = await getAccessToken()
        if(!tkn){
          setAuthenticated(false)
          localStorage.clear()
          setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
        }
        setQueryToken(tkn)
      }else {
        setQueryToken(qry_token)
      }
      
      // Incase of reload check if user data is stored if not make API request to get data
      const usr_dt = await JSON.parse(localStorage.getItem("usr_dt")) || {}
      if (!usr_dt.hasOwnProperty("display_name")){
        const tk = localStorage.getItem("acc_tk")
        const userData = await fetchProfile(tk);
        const err = handleError(userData)
        if(err === "failed"){localStorage.clear(); }
        if(!userData.hasOwnProperty("display_name")){
          setAuthenticated(false)
          setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
        }
        setUserProfile(userData);
      }else {setUserProfile(usr_dt);}
      
      // Check if customer is registered to use app 
      const reg = localStorage.getItem("reg")
      const user_dta = await JSON.parse(localStorage.getItem("usr_dt")) || {}
      if(!reg){
        const check_user = await checkUserRegistered(user_dta.email)
        if(check_user.hasOwnProperty("name")){
          if(check_user.pending && !check_user.registered) {
            setRegisterPending(true)
          }else if (!check_user.pending && check_user.registered){
            setRegistered(true)
          }
        }
      }else {setRegistered(reg)}
    }
  
  //Check if the user have looged in with their spotify account
  const auth = localStorage.getItem("code")
  if (auth && authenticated) {
    fetchData();
    return
  }

  }, [authenticated, code])

  // on redirect from spotify check if a code is present in the url params
  // set authenticated if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || localStorage.getItem("code")
    if (code ) {
      setCode(code);
      setAuthenticated(true);
      localStorage.setItem("code", code)
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    else {
      setAuthenticated(false);
    }
  }, [])

  // Function to handle Search query 
  const handleSearch = async(e) => {
    e.preventDefault();
    // exit if input is empty 
    if(!query){
      return 
    }
    
    const data = await getSongs(query, queryToken); // make API request to search for user input
    const data_error = handleError(data); // check if an error was returned  
    // if error log a message to the user
    if (data_error && !data.hasOwnProperty("tracks")){
      setMessage({msg:"Ooops!! Something went wrong. Try Again later"})
      return;}
    // No errors store the data 
    const tracks = await processTracks(data.tracks.items);
    setTrackData(tracks);
    setQuery("")
  }

  // Function to handle creating playlist on spotify and saving selected tracks to it. 
  const savePlaylistToSpotify = async({target}) => {
    // Get the playlist name from the input field in the DOM
    const playlistTitle = document.getElementById("playlist-title")
    const playlist_name = playlistTitle.value
  
    // If playlist title is not set alert user else continue
    if(!playlist_name) {
      setMessage({msg:"Please enter a playlist title ", color:"orange", show:true})
      return
    }
    // if playlist is empty  alert user else continue
    if(playlist.length < 1) {
      setMessage({msg:"Please add song(s) to your playlist", color:"orange", show:true})
      return
    }
    
    // create a playlist on user spotify account 
    const playlist_details = await createPLaylist(playlist_name, accessToken, userProfile.id)
    let playlist_error = await handleError(playlist_details) // Check for errors and handle them appropriately 
    if(playlist_error && !playlist_details.hasOwnProperty("id")){
      setMessage({msg:"Something went Wrong", color:"red", show:true})
      return
    };
    
    // Save Selected songs to the created playlist 
    const {id} = playlist_details;
    const track_ur1s = playlist.map(itm => itm.uri);
    const response = await addTracksToSpotifyPlaylist(id, track_ur1s, accessToken);
    const addtrack_error = await handleError(response); // Check for errors and handle errors
    if(addtrack_error && !response.hasOwnProperty("snapshot_id")){return};
    setMessage(
      {
        msg:`Success, All selected tracks/songs have been added to your newly created ${playlist_name} playlist and saved to your spotify account... Listen on Spotify.. Enjoy!!!!`, 
        color:"green", 
        show:true,
      }
    )
    //  if successful clear the playlist and the playlist title
    playlistTitle.value = "";
    setPlaylist([])
  }
   
  // Handle message logging to the user
  const messengeLogger = ({color, msg, show, main}) => {
    // initialize the two divs for logging message to the user
    const msgdiv = window.document.querySelector('#msg');
    const loginErrordiv = window.document.querySelector("#loginError");
    // if show is true use the msgdiv to display message
    if (show) {
      msgdiv.style.display = "block"
      msgdiv.style.backgroundColor = color;
      msgdiv.innerText = msg;
      setTimeout(() => {
        msgdiv.style.display = "none"
        setMessage(prev => ({...prev, show: false}))
      }, 7000);
    }
    // if main is true use the loginErrordiv to display message
    else if (main) {
      loginErrordiv.style.display = "block"
      loginErrordiv.style.backgroundColor = color;
      loginErrordiv.innerText = msg;
      setTimeout(() => {
        loginErrordiv.style.display = "none"
        setMessage(prev => ({...prev, main: false}))
      }, 7000);
    }
  }
  
  //  Function for adding tracks from the trackData array to the playlst array
  const addToPlaylist = (id) => {
    const track = trackData.find(itm => itm.id === id)
    const alreadyPresent = playlist.some(itm => track.id === itm.id);
    // Check if the track is already added
    if (!alreadyPresent){
      setPlaylist(prev => [...prev, track]) 
    }else {
      setMessage({msg:"Already Added to playlist", color:"blue", show:true})
    }
  }

  // Function to remove tracks from the playlist Array
  const removeSongFromPlaylist = (id) => {
    setPlaylist(prev => prev.filter(itm => itm.id !== id))
  } 
  
  // Helper Function to extract needed data from spotify search query result 
  function processTracks (arr) {
    return arr.map((itm, idx) => {
      return {
        songtitle: itm.name,
        album:itm.album.name,
        id: itm.id,
        uri:itm.uri,
        artist: itm.artists.map((itm) => itm.name).join(" & "),
      }
    })
  }

  //  Function to allow User make request to get registered to use the app 
  const registerRequest =  async() => {
    const response = await requestToRegister(userProfile.display_name, userProfile.email)
    if (response.hasOwnProperty("error")) {
      setMessage({msg:"Something went wrong try again later", show:false, main:true, color:"red"})
    }else {
      setRegisterPending(true)
    }
  }

  // Function to handle API request errors
  const handleError = async(res) => {
    if(res.hasOwnProperty("error")){
      // Check if the error is 'access token expired' 
      if (res.error.message === "The access token expired") {
        setMessage({msg:"AccessToken Expired.. Getting a new One... Try Again in 10 seconds", color:"orange", show:true})
        // Make request to get new access tokens
        const token = await getRefreshToken()
        const qrytk = await getAccessToken()
        // if no token set redirect user to login again to their account
        if(!token || !qrytk) {
          setMessage({msg:"Sorry!!!, Your Login Session have Expired.. Please login Again...", color:"red", main:true})
          setAuthenticated(false)
          localStorage.clear()
          return "failed"
        }
        // Set token if successful and store the token
        setAccessToken(token)
        setMessage({msg: "Token successfully refreshed", color:"green", main:true})
        return false
      }
      // handle other errors
      else{
        setMessage({msg: res.error.message, color:"red", show:true})
        console.log("Error Occurred", res.error.message)
        return true
      }
    }
    return false // return false if no error
  } 

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
  }
 
  return (
    <>  
        {
          message.hasOwnProperty("msg") && (message.show || message.main) && 
          <>
            {messengeLogger(message)}
          </>
        }
        <div id="loginError"></div>
        {!authenticated ? <LogIn /> : 
        (
          <>
            <header>
                  <h1 className="jam">Ja<span className="min">mm</span>ing</h1>
            </header>
            <main id="main-container">
            {userProfile.hasOwnProperty("email") &&
              <>
                <div className="image-container">
                  <img src={userProfile.images[1].url} alt="profile_image" id="profile-pics" />
                </div>
                <h2 className="greetings">Hi, <span className="username">{userProfile.display_name.split(" ")[0]}</span></h2>

              </>

            }

              { registerPending ?
                (
                  <div className="register">
                      <p>
                        Your registration request is being processed.<br/>    
                        You will be notified via email when it's completed. Please check back later.<br/> <span> Thank you </span> 
                      </p>
                  </div>
                ):
                registered ?   
                  (<UserAllowed 
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch} 
                    trackData={trackData} 
                    addToPlaylist={addToPlaylist} 
                    playlist={playlist}
                    removeSongFromPlaylist={removeSongFromPlaylist}
                    savePlaylistToSpotify={savePlaylistToSpotify}
                    logout={handleLogout}
                  />) 
                  :
                  (<Register registerRequest={registerRequest} />)
              }
            </main>
          </>
        )}
    </>
  )
}

export default App;

