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
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const res = await login(formData)
            await setStoreValue("token", res.token)
            navigate("/")
        } catch (error) {
            setInlineMessage("Failed to login. Please try again")
        }
    }

    return (
        <Page>
            <div className="login-container">
                <h1 classNam="login-title">Login</h1>
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
                    <label>
                        <p>Password</p>
                        <input
                            id="password"
                            name="password"
                            type="text"
                            value={formData.password}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                    </label>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <div className="login-links">
                    <Link to="/" className="login-link">
                        Forgot password?
                    </Link>
                    <Link to="/signup" className="login-link">
                        SignUp
                    </Link>
                </div>
            </div>
        </Page>
    )
}

export default Login

