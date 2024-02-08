import React from "react"

export function AddPlaylist({playlistTracks, removeSongFromPlaylist, savePlaylistToSpotify}) {
    return (
        <>
            <input id="playlist-title" type="text" className="playlistname" placeholder="Enter Playlist Tittle " />
            { 
                playlistTracks.map((itm,idx) => (
                    <ul className="result-list" key={idx}>
                        <li className="res">
                            <h5 className="song">{itm.songtitle}
                                <div className="artist">{itm.artist}</div>
                                <div className="album">{itm.album}</div>
                            </h5>
                            <button className="removebutton" onClick={() => {removeSongFromPlaylist(itm.id)}}>-</button>
                        </li>
                    </ul>
                ))
            }
            <button className="saveplaylist" onClick={savePlaylistToSpotify}>SAVE TO SPOTIFY </button>
        </>
    )
}