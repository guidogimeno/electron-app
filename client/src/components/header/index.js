import React, { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import UserSvg from "../../assets/user_svg.js"
import { GlobalContext } from "../../context/index.js"

const logo = <img src="src/assets/logo-hippal.jpeg" ></img>

function Header() {
    const context = useContext(GlobalContext)
    const username = context.user.name

    const [open, setOpen] = useState(false)

    let popupRef = useRef()

    useEffect(() => {
        let handler = function(event) {
            if (!popupRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler);

        return function() {
            document.removeEventListener("mousedown", handler)
        }
    }, [])

    return (
        <header>
            <div className="logo">
                {username ? <Link to="/my_hips">{logo}</Link> : logo}
            </div>
            <div className="user" >
                <UserSvg onClick={() => setOpen(prev => !prev)} />
                <p>{username}</p>
                <div className={`user-popup ${open ? "active" : "inactive"}`} popupRef={popupRef}>
                    <p>{username}</p>
                    <button onClick={() => console.log("profile")}>My Profile</button>
                    <button onClick={() => console.log("edit")}>Edit Profile</button>
                    <button onClick={() => console.log("logout")}>Logout</button>
                </div>
            </div>
        </header>
    )
}

export default Header

