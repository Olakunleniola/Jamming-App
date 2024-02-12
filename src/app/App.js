
import React from "react";
import {useState, useEffect} from "react";
import '../jamming.css';
import { Search } from "../components/Search";
import { LogIn } from "../components/Login";
import {SearchResult} from "../components/SearchResult";
import {AddPlaylist} from "../components/AddPlaylist";
import {
  getAccessToken,
  fetchProfile, 
  getSongs, 
  getRefreshToken,
  createPLaylist,
  addTracksToSpotifyPlaylist,
  getUserAccessToken,
} from "../api/api"
import { userdata } from "../data/mock_data";

const mytoken = "BQDbFAExxh7hZC28KN82w4UzVUiYuo_MYN0wpGPcuTqHe5d3cm326XHLzlmeLEeTHo_FkYJuKtp5lvPZqg_2CxAkxB-tqYc-LZE0OUEzZBRXXloXDmg"
const usertoken = "BQBeEDte6u2irWOxLvJJwEPwUHd-n290raVyK-7D16tlJoLA-sxW3nnHNhG48XU3qGwNpOqJUe3hL1POxn64FvSRNsH9blPMKj9OatOpJh_pfge75M4lUix5RfjcWt7ZitLO3_qYxNohZ0BOcSMNLTGKuID_HyXDUohy26HW9TdNH7ChVg2hTq5zbGtv78MblkTasICSiN9jNSu8jgt3ZLYNZBOrcOSOGDEpWvfg-OvoK73E9j5Qe5PSclu9ZND4_PpEXYz8zz8BQi3d"

function App() {  
  const [code, setCode] = useState("")
  const [accessToken, setAccessToken] = useState(mytoken); 
  const [userAccessToken, setUserAccessToken ] = useState(usertoken);
  const [authenticated, setAuthenticated] = useState(true);
  const [userProfile, setUserProfile] = useState(userdata);
  const [query, setQuery] = useState("");
  const [trackData, setTrackData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [message, setMessage] = useState({});

  // Get user access token and profile data if authenticated
  // useEffect(() => {
  //   async function getToken(){

  //     const userToken = await getUserAccessToken(code);
  //     if(userToken.hasOwnProperty("error")){
  //       setAuthenticated(false)
  //       setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
  //     }
  //     setUserAccessToken(userToken)
      
  //     const tokenData = await getAccessToken()
  //     if(!tokenData){
  //       setAuthenticated(false)
  //       setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
  //     }
  //     console.log(tokenData)
  //     setAccessToken(tokenData);

  //     const userData = await fetchProfile(userToken);
  //     if(!userData.hasOwnProperty("display_name")){
  //       setAuthenticated(false)
  //       setMessage({msg: "Something Went Wrong... Try Logging in Again..", main:true, color:"red" })
  //     }
  //     setUserProfile(userData);
  //     console.log(tokenData); // Use the token data as needed
  //     console.log(userData); // Use the token data as needed
  //   }
    
  //   if (authenticated) {
  //     getToken();
  //     return
  //   }

  // }, [authenticated, code])

  // on redirect from spotify check if a code is present in the url params
  // set authenticated if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setCode(code);
      setAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
 
    else {
      // setAuthenticated(false);
    }
  }, [])

  
  const handleSearch = async(e) => {
    e.preventDefault();
    if(!query){
      return 
    }
    const data = await getSongs(query, accessToken);
    const data_error = handleError(data);
    if (data_error && !data.hasOwnProperty("tracks")){return;}
    const tracks = await processTracks(data.tracks.items);
    setTrackData(tracks);
    setQuery("")
  }

  const savePlaylistToSpotify = async({target}) => {
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
    const playlist_details = await createPLaylist(playlist_name, userAccessToken, userProfile.id)
    let playlist_error = await handleError(playlist_details)
    if(playlist_error && !playlist_details.hasOwnProperty("id")){
      setMessage({msg:"Something went Wrong", color:"red", show:true})
      return
    };
    
    // Save Selected songs to the created playlist 
    const {id} = playlist_details;
    const track_ur1s = playlist.map(itm => itm.uri);
    const response = await addTracksToSpotifyPlaylist(id, track_ur1s, userAccessToken);
    const addtrack_error = await handleError(response);
    if(addtrack_error && !response.hasOwnProperty("snapshot_id")){return};
    setMessage(
      {
        msg:`Success, All selected tracks/songs have been added to your newly created ${playlist_name} playlist and saved to your spotify account... Listen on Spotify.. Enjoy!!!!`, 
        color:"green", 
        show:true,
      }
    )
    playlistTitle.value = "";
    setPlaylist([])
  }
    
  const messengeLogger = ({color, msg, show, main}) => {
    const msgdiv = window.document.querySelector('#msg');
    const loginErrordiv = window.document.querySelector("#loginError");
    if (show) {
      msgdiv.style.display = "block"
      msgdiv.style.backgroundColor = color;
      msgdiv.innerText = msg;
      setTimeout(() => {
        msgdiv.style.display = "none"
        setMessage(prev => ({...prev, show: false}))
      }, 7000);
    }
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
    
  const addToPlaylist = (id) => {
    const track = trackData.find(itm => itm.id === id)
    const alreadyPresent = playlist.some(itm => track.id === itm.id);
    if (!alreadyPresent){
      setPlaylist(prev => [...prev, track]) 
    }else {
      setMessage({msg:"Already Added to playlist", color:"blue", show:true})
    }
  }

  const removeSongFromPlaylist = (id) => {
    setPlaylist(prev => prev.filter(itm => itm.id !== id))
  } 
  
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

  const handleError = async(res) => {
    if(res.hasOwnProperty("error")){
      if (res.error.message === "The access token expired") {
        setMessage({msg:"AccessToken Expired.. Getting a new One... Try Again in 10 seconds", color:"orange", show:true})
        const token = await getRefreshToken()
        if(!token) {
          setAuthenticated(false)
          // redirectToAuthCodeFlow()
          setMessage({msg: "Sorry!!!, Your Login Session have Expired.. Please login Again...", color:"red", show:false, main:true})
          return true
        }
        setAccessToken(token)
        return false
      }else{
        setMessage({msg: res.error.message, color:"red", show:true})
        console.log("Error Occurred", res.error.message)
        return true
      }
    }
    return false
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
                  <h1>Ja<span>mm</span>ing</h1>
            </header>
            <main id="main-container">
              { userProfile.hasOwnProperty("display_name") &&
                <>
                  <div className="image-container">
                    <img src={userProfile.images[1].url} alt="profile_image" id="profile-pics" />
                  </div>
                  <h2 className="greetings">Hi, <span className="username">{userProfile.display_name.split(" ")[0]}</span></h2>
                </>
              }
              <Search 
                  query={query}
                  setQuery={setQuery}
                  handleSearch={handleSearch}
              />
              <div className="container">
                <div id="msg"></div>
                { trackData.length > 0 &&
                  <>
                    <div className="result-cont">
                      <h2>Results</h2>   
                      <SearchResult 
                        trackData = {trackData}
                        addToPlaylist={addToPlaylist} 
                      /> 
                    </div>
                    <div className="playlist">
                      <AddPlaylist 
                          playlistTracks={playlist} 
                          removeSongFromPlaylist={removeSongFromPlaylist} 
                          savePlaylistToSpotify={savePlaylistToSpotify} 
                      />
                    </div>     
                  </>
                }
              </div>
            </main>
          </>
        )}
    </>
  )
}

export default App;

