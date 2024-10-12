import React, { useContext } from "react"
import { GlobalContext } from "../../context/index.js"
import { createPortal } from "react-dom"
import ExclamationSvg from "../../assets/exclamation_svg.js"
import CheckCircleSvg from "../../assets/check_circle_svg.js"

function Icon(props) {
    switch (props.type) {
        case "success": return <CheckCircleSvg />
        case "failure": return <ExclamationSvg />
        case "info": return <CheckCircleSvg />
        case "warning": return <ExclamationSvg />
    }
}

function Notification() {
    const context = useContext(GlobalContext)

    return createPortal(
        <div className="notification-container">
            {
                context.notifications.map(notification => {
                    return (
                        <div key={notification.id} className={`notification ${notification.type}`}>
                            <Icon type={notification.type} />
                            <span>
                                {notification.message}
                            </span>
                        </div>
                    )
                })
            }
        </div>,
        document.getElementById("portal")
    )
}

export default Notification

