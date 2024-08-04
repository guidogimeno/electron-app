import { createContext, useState } from "react"

function useNotifications() {
    const [notifications, setNotifications] = useState([])

    function showNotification(message, type) {
        const notificationId = Date.now()
        addNotification({ id: notificationId, message, type })
        setTimeout(() => {
            removeNotification(notificationId)
        }, 3000)
    }

    function addNotification(notification) {
        setNotifications(prevNotifications => {
            return [...prevNotifications, notification]
        })
    }

    function removeNotification(id) {
        setNotifications(prevNotifications => {
            return prevNotifications.filter(notification => notification.id !== id)
        })
    }

    function showSuccess(message) {
        showNotification(message, "success")
    }

    function showFailure(message) {
        showNotification(message, "failure")
    }


    function showInfo(message) {
        showNotification(message, "info")
    }


    function showWarning(message) {
        showNotification(message, "warning")
    }

    return { notifications, showSuccess, showFailure, showInfo, showWarning }
}

const GlobalContext = createContext()

export {
    GlobalContext,
    useNotifications
}

