import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/login/index.js"
import { setStoreValue } from "../../store/index.js"
import { useNavigate } from "react-router-dom"

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
        <div>
            <h1>Login</h1>
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

            <p>Don't have an account?</p>
            <button>
                <Link to="/signup">SignUp</Link>
            </button>
        </div>
    )
}

export default Login

