import React from "react"
import { createRoot } from "react-dom/client"
import Login from "./views/login/index.js"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<Login />)

