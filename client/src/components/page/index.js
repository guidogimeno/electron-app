import React from "react"
import Header from "../header/index.js"

function Page(props) {
    return (
        <>
            <Header />
            <main>
                {props.children}
            </main>
            <footer>
            </footer>
        </>
    )
}

export default Page

