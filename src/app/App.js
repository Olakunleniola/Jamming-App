/* access_token=BQAJwJ5JD6_zW2NiiLQg-euJO75xyqSfu2kx18UgXuR8ku2LgZP8lmizrWDfHLtzyOHevE1bXe5QIjY1eleCTSepLluSq_8NbM37BNfgacRZzi0GXZNSweUjq0a49NU_JGbFltskjdogOqAQcgfTxgeNUI1GFDuRP073zaQUVgLdafF96P545iYTYv9QGABFEZkAsGYjVWN_WANgNPCeq-R0_gHFFbXFAI8w18eAzSSEuYzDKiClqPtM9hRUlWIs7lc
*/

import {useState, useEffect} from "react";
import {getAccessToken} from "../api/api"
import '../App.css';
import { redirectToAuthCodeFlow } from "../api/api";
import { LogIn } from "../jamming_app_spotify/src/components/Login";
import { fetchProfile } from "../api/api";
import { Search } from "../jamming_app_spotify/src/components/Search";


function App() {

  const [accessToken, setAccessToken] = useState(null); 
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  // Get user access token and profile data if authenticated
  // useEffect(() => {
  //   async function getToken(){
  //     try {
  //       const tokenData = await getAccessToken();
  //       const userData = await fetchProfile(tokenData);
  //       setAccessToken(tokenData);
  //       setUserProfile(userData);
  //       console.log(tokenData); // Use the token data as needed
  //       console.log(userData); // Use the token data as needed
  //     } catch (error) {
  //       console.error('Error fetching access token:', error);
  //     }
  //   }
    
  //   if (authenticated) {
  //     getToken();
  //   } else {
  //     return 
  //   }
  
  // }, [authenticated])

  // on redirect from spotify check if a code is present in the url params
  // set authenticated if present
  
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        setAuthenticated(true)
      }else {
        setAuthenticated(false)
        return
      }
  }, [])



  return (
    <>
        {!authenticated ? <LogIn  handleLogIn={redirectToAuthCodeFlow}/> : 
        (
          <>
            <header>
                  <h1>Ja<span>mm</span>ing</h1>
            </header>
            <main id="main-container">
              <div className="image-container">
                  <img src="" alt="profile_image" id="profile-pics" />
              </div>
              <h2 className="greetings">Hi, <span className="username"> </span></h2>
              <Search 
                  query={search}
                  setSearch={setSearch}
                  handleSearch={handleSearch}
                  songData={songData}
                  updatePlaylist={updatePlaylist}
                  playlistSongs={playlistSongs}
                  removeItemFromPlayist={removeItemFromPlayist}
              />
              <div classNameName="container">

              </div>
            </main>


          </>
        )}
    </>
  )
}

export default App;
