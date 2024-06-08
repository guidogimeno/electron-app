import React from "react"
import Header from "../header/index.js"

function Page(props) {
    return (
        <div>
            <Header />
            {props.children}
        </div>
    )
}

export default Page

