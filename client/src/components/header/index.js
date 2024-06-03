import React from "react"

function Header() {
    return (
        <header>
            <div className="logo">
                <img src="logo.png" alt="Application Logo"></img>
            </div>
            <div className="user">
                <img src="avatar.png" alt="User Avatar"></img>
                <span>User name</span>
                <button id="loginButton">Login</button>
                <button id="logoutButton">Logout</button>
            </div>
        </header>
    )
}

export default Header

