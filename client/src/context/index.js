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

    return [notifications, showNotification]
}

const GlobalContext = createContext()

export {
    GlobalContext,
    useNotifications
}

