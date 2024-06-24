import React from "react"
import { useState } from "react"
import { signup } from "../../services/signup/index.js"
import { useNavigate } from "react-router-dom"
import Page from "../../components/page/index.js"


function SignUp() {
    const [formData, setFormData] = useState({ username: "", password: "", email: "" })
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
            await signup(formData)
            navigate("/login")
        } catch (error) {
            setInlineMessage("Failed to sign up. Please try again")
        }
    }

    return (
        <Page hiddeSidebar >
            <div className="signup-container">
                <div className="signup-content">
                    <h1 className="signup-title">Sign Up</h1>
                    {inlineMessage && <p className="inline-message">{inlineMessage}</p>}
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    );
}

export default SignUp

