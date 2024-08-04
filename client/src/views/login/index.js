import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/login/index.js"
import { setStoreValue } from "../../store/index.js"
import { useNavigate } from "react-router-dom"
import Page from "../../components/page/index.js"

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [inlineMessage, setInlineMessage] = useState("")

    const navigate = useNavigate()

    function handleChange(event) {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const res = await login(formData)
            await setStoreValue("token", res.token)
            navigate("/my_hips")
        } catch (error) {
            setInlineMessage("Failed to login. Please try again")
        }
    }

    return (
        <Page hiddeSidebar>
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login</h1>
                    <p className="inline-message">{inlineMessage}</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                    <div className="login-links">
                        <Link to="/my_hips" className="login-link">
                            Forgot password?
                        </Link>
                        <Link to="/signup" className="login-link">
                            SignUp
                        </Link>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default Login

