import React from "react"
import SearchSvg from "../../assets/search_svg.js"

function Search(props) {

    return (
        <div className="search-container">
            <SearchSvg />
            <input
                type="text"
                placeholder="Search in Hip Pal"
                onChange={(event) => props.onChange(event.target.value)}
            />
        </div>
    )
}

export default Search

