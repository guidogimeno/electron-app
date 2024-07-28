import React, { useContext } from "react"
import { GlobalContext } from "../../context/index.js"

function Notification() {
    const context = useContext(GlobalContext)

    return (
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
        </div>
    )
}

export default Notification

