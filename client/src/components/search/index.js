import React from "react"

function Search(props) {

    return (
        <div className="search-container">
            <span>icono de lupa</span>
            <input
                type="text"
                placeholder="Search in Hip Pal"
                onChange={(event) => props.onChange(event.target.value)}
            />
        </div>
    )
}

export default Search

