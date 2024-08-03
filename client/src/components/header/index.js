import React from "react"
import { Link } from "react-router-dom"
import UserSvg from "../../assets/user_svg.js"

function Header() {
    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <img src="src/assets/logo-hippal.jpeg" alt="Application Logo" ></img>
                </Link>
            </div>
            <div className="user">
                <UserSvg />
                <p>User name</p>
            </div>
        </header>
    )
}

export default Header

