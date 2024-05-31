import React from "react"
import { HashRouter, Routes, Route }  from "react-router-dom"
import { createRoot } from "react-dom/client"
import Login from "./views/login/index.js"
import SignUp from "./views/signup/index.js"

const container = document.getElementById("root")
const root = createRoot(container)

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </HashRouter>
    )
}

root.render(<App />)

