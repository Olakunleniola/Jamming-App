import React from "react"


export function Search ({handleSearch, query, setQuery}) {
    
    return (
        <>
            <form action="#" onSubmit={handleSearch}>
                    <input type="text" name="search" value={query || ""} onChange={(e) => setQuery(e.target.value)} placeholder="Enter the Song Title Here"/>
                    <button type="search">Search</button>
            </form> 
        </>
    )
}
