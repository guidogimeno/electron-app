import React from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { createRoot } from "react-dom/client"
import Home from "./views/home/index.js"
import Login from "./views/login/index.js"
import SignUp from "./views/signup/index.js"

const container = document.getElementById("root")
const root = createRoot(container)

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </HashRouter>
    )
}

root.render(<App />)

