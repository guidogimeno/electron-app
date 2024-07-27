import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
    { label: "+New", to: "/analyze" },
    { label: "Home", to: "/" },
    { label: "Analysis", to: "/analysis" },
    { label: "Shared with me", to: "/shared" },
    { label: "Trash", to: "/trash" }
]

function Sidebar() {
    const pathname = useLocation().pathname

    return (
        <div className="sidebar">
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
        </div >
    )
}

export default Sidebar
