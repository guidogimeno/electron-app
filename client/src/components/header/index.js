import React from "react"
import { Link } from "react-router-dom"

function Header() {
    return (
        <header>
            <div className="logo">
                <img src="src/assets/logo.png" alt="Application Logo" width={50} height={50}></img>
            </div>
            <div className="user">
                <img src="src/assets/persona.png" alt="User Avatar" width={30} height={100}></img>
                <span>User name</span>
                <button id="loginButton">
                    <Link to="/login">Login</Link>
                </button>
                <button id="logoutButton">
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header

