import React from "react"
import { Link, useLocation } from "react-router-dom"
import CirclePlusSvg from "../../assets/circle_plus_svg.js"
import FolderSvg from "../../assets/folder_svg.js"
import ProfileSvg from "../../assets/profile_svg.js"
const links = [
    { label: "Mis Mediciones", to: "/my_hips", icon: <FolderSvg /> },
    { label: "Mi Perfil", to: "/profile", icon: <ProfileSvg /> }
]

function Sidebar() {
    const pathname = useLocation().pathname

    return (
        <div className="sidebar">
            <Link to="/analyze" className="sidebar-new-button">
                <CirclePlusSvg />
                Nuevo
            </Link>
            <div className="sidebar-secondary-buttons">
                {
                    links.map(button => {
                        return <Link
                            key={button.label}
                            to={button.to}
                            className={`sidebar-button ${pathname === button.to ? "selected" : ""} `}
                        >
                            {button.icon}
                            {button.label}
                        </Link>
                    })
                }
            </div>
        </div >
    )
}

export default Sidebar
