import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import UserSvg from "../../assets/user_svg.js"
import { GlobalContext } from "../../context/index.js"
import { setStoreValue } from "../../store/index.js"

const logo = <img src="src/assets/logo-hippal.jpeg" ></img>

function Header() {
    const navigate = useNavigate()
    const context = useContext(GlobalContext)

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
                {context.user ? <Link to="/my_hips">{logo}</Link> : logo}
            </div>
            <div className="user" >
                <UserSvg onClick={() => setOpen(prev => !prev)} />
                {context.user ? <p>{context.user.firstName}</p> : null}
                <div className={`user-popup ${open ? "active" : "inactive"}`} ref={popupRef}>
                    {
                        context.user ?
                            <>
                                <p>{context.user.firstName}</p>
                                <Link to="/profile">My Profile</Link>
                                <button onClick={async () => {
                                    await setStoreValue("token", "")
                                    context.setUser(null)
                                    navigate("/login")
                                }}>
                                    Logout
                                </button>
                            </>
                            :
                            <>
                                <button onClick={() => navigate("/login")}>
                                    Login
                                </button>
                                <button onClick={() => navigate("/signup")}>
                                    Sign Up
                                </button>
                            </>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header

