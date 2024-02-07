import React from "react"


export function Search ({handleSearch, query, setSearch}) {
    
    return (
        <>
            <form action="#" onSubmit={handleSearch}>
                    <input type="text" name="search" value={query || ""} onChange={(e) => setSearch(e.target.value)} placeholder="Enter the Song Title Here"/>
                    <button type="search">Search</button>
            </form> 
        </>
    )
}
