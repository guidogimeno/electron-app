import React from "react"
import { Link, useLocation } from "react-router-dom"
import CirclePlusSvg from "../../assets/circle_plus_svg.js"
import FolderSvg from "../../assets/folder_svg.js"

const links = [
    { label: "My Hips", to: "/my_hips", icon: <FolderSvg /> },
]

function Sidebar() {
    const pathname = useLocation().pathname

    return (
        <div className="sidebar">
            <Link to="/analyze" className="sidebar-new-button">
                <CirclePlusSvg />
                New
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
