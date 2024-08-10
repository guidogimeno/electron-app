import React, { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { createRoot } from "react-dom/client"
import Login from "./views/login/index.js"
import Landing from "./views/landing/index.js"
import SignUp from "./views/signup/index.js"
import NewAnalysis from "./views/new_analysis/index.js"
import { GlobalContext, useNotifications } from "./context/index.js"
import MyHips from "./views/my_hips/index.js"
import Hip from "./views/hip/index.js"
import Profile from "./views/profile/index.js"

const container = document.getElementById("root")
const root = createRoot(container)

function App() {
    const [user, setUser] = useState(null)
    const {
        notifications,
        showSuccess,
        showFailure,
        showInfo,
        showWarning
    } = useNotifications()

    return (
        <GlobalContext.Provider value={{
            notifications,
            showSuccess,
            showFailure,
            showInfo,
            showWarning,

            user,
            setUser
        }}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/my_hips" element={<MyHips />} />
                    <Route path="/my_hips/:id" element={<Hip />} />
                    <Route path="/analyze" element={<NewAnalysis />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </HashRouter>
        </GlobalContext.Provider>
    )
}

root.render(<App />)

