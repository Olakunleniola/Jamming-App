import React from "react";
import {SearchResult} from "./SearchResult";
import {AddPlaylist} from "./AddPlaylist";


export const Playlist = ({songData, updatePlaylist, playlistSongs, removeItemFromPlayist}) => {
    return (
        <>
            <div classNameName="result-cont">
                <h2>Results</h2> 
                {songData &&
                    songData.map(((songs,idx) => <SearchResult songtitle={songs.songtitle} artist={songs.artist} key={idx} updatePlaylist={updatePlaylist} id={songs.id} /> ))
                }
            </div>

            <div classNameName="playlist">
                <AddPlaylist playlistSongs={playlistSongs} removeItemFromPlayist={removeItemFromPlayist} />
            </div>
        </>
    )
}
