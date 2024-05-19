const React = require("react")
const { createRoot }  = require("react-dom/client")
const Login = require("./views/login")

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<Login />)

