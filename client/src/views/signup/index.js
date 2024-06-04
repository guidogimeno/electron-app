import React from "react"
import { useState } from "react"
import { signup } from "../../services/signup/index.js"
import { useNavigate } from "react-router-dom"


function SignUp() {
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
            await signup(formData)
            navigate("/login")
        } catch (error) {
            setInlineMessage("Failed to sign up. Please try again")
        }
    } 

    return (
        <div>
            <h1>Sign Up</h1>
            <p className="inline-message">{inlineMessage}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        name="username"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default SignUp

