import React from "react"

export function SearchResult({trackData, addToPlaylist}) {
    return (
        <>
            {
                trackData.map((track,idx) =>  
                    <ul className="result-list" key={idx}>
                        <li className="res">
                            <h5 className="song">{track.songtitle}
                                <div className="artist">{track.artist}</div>
                                <div className="album">{track.album}</div>
                            </h5>
                            <button className="addbutton" onClick={() => {addToPlaylist(track.id)}} >+</button>
                        </li>
                    </ul>
                )
            }
        </>
    )
}