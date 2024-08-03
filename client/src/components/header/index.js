import React, { useContext } from "react"
import { Link } from "react-router-dom"
import UserSvg from "../../assets/user_svg.js"
import { GlobalContext } from "../../context/index.js"

const logo = <img src="src/assets/logo-hippal.jpeg" ></img>

function Header() {
    const context = useContext(GlobalContext)
    const username = context.user.name

    return (
        <header>
            <div className="logo">
                {username ? <Link to="/my_hips">{logo}</Link> : logo}
            </div>
            <div className="user">
                <UserSvg />
                <p>{username}</p>
            </div>
        </header>
    )
}

export default Header

