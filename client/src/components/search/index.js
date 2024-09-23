import React from "react"
import SearchSvg from "../../assets/search_svg.js"

function Search(props) {

    return (
        <div className="search-container">
            <SearchSvg className="search-icon" />
            <input
                type="text"
                placeholder="Buscar en HipPal"
                onChange={(event) => props.onChange(event.target.value)}
            />
        </div>
    )
}

export default Search

