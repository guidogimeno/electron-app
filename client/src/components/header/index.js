import React from "react"
import { Link } from "react-router-dom"

function Header() {
    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <img src="src/assets/logo.png" alt="Application Logo" width={50} height={50}></img>
                </Link>
            </div>
            <div className="user">
                <img src="src/assets/persona.png" alt="User Avatar" width={30} height={100}></img>
                <span>User name</span>
            </div>
        </header>
    )
}

export default Header

