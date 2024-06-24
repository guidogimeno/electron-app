import React from "react"
import Header from "../header/index.js"
import Sidebar from "../sidebar/index.js"

function Page(props) {
    return (
        <>
            <Header />
            <main>
                {props.hiddeSidebar ? null : <Sidebar />}
                <div className="content">
                    {props.children}
                </div>
            </main>
            <footer />
        </>
    )
}

export default Page

