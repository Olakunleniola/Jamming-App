import React from "react"

export function SearchResult({songtitle, artist, updatePlaylist, id}) {
    return (
        <>
            <ul className="result-list">
                <li className="res">
                    <h5 className="song">{songtitle}<div className="artist">{artist}</div></h5>
                    <button className="addbutton" onClick={() => {updatePlaylist(id)}} >+</button>
                </li>
            </ul>
        </>
    )
}