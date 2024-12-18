import React from "react"
import Header from "../header/index.js"
import Sidebar from "../sidebar/index.js"
import Notification from "../notification/index.js"

function Page(props) {
    return (
        <>
            <Header />
            <main>
                {props.hiddeSidebar ? null : <Sidebar initialState={props.initialState} />}

                <div className={`content ${props.hiddeSidebar ? "" : "content--with-sidebar"}`}>
                    {props.children}
                    <Notification />
                </div>
            </main>
            <footer />
        </>
    )
}

export default Page

