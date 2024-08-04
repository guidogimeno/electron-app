import React, { useContext } from "react"
import { GlobalContext } from "../../context/index.js"
import { createPortal } from "react-dom"

function Notification() {
    const context = useContext(GlobalContext)

    return createPortal(
        <div className="notification-container">
            {
                context.notifications.map(notification => {
                    return (
                        <div key={notification.id} className={`notification ${notification.type}`}>
                            <p>{notification.type}</p>
                            {notification.message}
                        </div>
                    )
                })
            }
        </div>,
        document.getElementById("portal")
    )
}

export default Notification

