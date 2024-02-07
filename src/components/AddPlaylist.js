import React from "react"

export function AddPlaylist({playlistSongs, removeItemFromPlayist}) {
    return (
        <>
            <input type="text" className="playlistname" placeholder="Enter Playlist " />
            { 
                playlistSongs && playlistSongs.map((itm,idx) => (
                    <ul className="result-list" key={idx}>
                        <li className="res">
                            <h5 className="song">{itm.songtitle}<div className="artist">{itm.artist}</div></h5>
                            <button className="removebutton" onClick={() => {removeItemFromPlayist(itm.id)}}>-</button>
                        </li>
                    </ul>
                ))
            }
            <button className="saveplaylist">SAVE TO SPOTIFY </button>
        </>
    )
}