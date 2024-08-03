import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// TODO: Le faltan los iconos
const links = [
    { label: "Home", to: "/" },
    { label: "Analysis", to: "/analysis" },
    { label: "Shared with me", to: "/shared" },
    { label: "Trash", to: "/trash" }
]

function Sidebar() {
    const pathname = useLocation().pathname

    return (
        <div className="sidebar">
            <Link to="/analyze" className="primary-button">
                + New
            </Link>
            <div className="sidebar-secondary-buttons">
                {
                    links.map(button => {
                        return <Link
                            key={button.label}
                            to={button.to}
                            className={`sidebar-button ${pathname === button.to ? "selected" : ""} `}
                        >
                            {button.label}
                        </Link>
                    })
                }
            </div>
        </div >
    )
}

export default Sidebar
