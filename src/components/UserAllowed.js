import React from "react";
import { Search } from "./Search";
import { AddPlaylist } from "./AddPlaylist";
import { SearchResult } from "./SearchResult";

export function UserAllowed ({query,setQuery,handleSearch, trackData, addToPlaylist, playlist, removeSongFromPlaylist, savePlaylistToSpotify}){
    return (
        <>
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
        </>
    )
}